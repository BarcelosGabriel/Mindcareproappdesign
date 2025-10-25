import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-755493d1/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Psychologist signup
app.post("/make-server-755493d1/auth/psychologist/signup", async (c) => {
  try {
    const { email, password, name, crp } = await c.req.json();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, crp, type: 'psychologist' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.error('Psychologist signup auth error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store psychologist data in KV
    await kv.set(`psychologist:${authData.user.id}`, {
      id: authData.user.id,
      email,
      name,
      crp,
      createdAt: new Date().toISOString()
    });

    // Initialize empty patients list
    await kv.set(`psychologist:${authData.user.id}:patients`, []);

    return c.json({ success: true, userId: authData.user.id });
  } catch (error) {
    console.error('Psychologist signup error:', error);
    return c.json({ error: 'Failed to create psychologist account' }, 500);
  }
});

// Patient signup (with invite code)
app.post("/make-server-755493d1/auth/patient/signup", async (c) => {
  try {
    const { inviteCode, name, age, phone } = await c.req.json();

    // Validate invite code
    const inviteData = await kv.get(`invite:${inviteCode}`);
    if (!inviteData || inviteData.used) {
      return c.json({ error: 'Invalid or already used invite code' }, 400);
    }

    // Create a unique email for patient (since they don't provide email)
    const patientEmail = `patient_${Date.now()}_${Math.random().toString(36).substring(7)}@mindcare.local`;
    const patientPassword = Math.random().toString(36).substring(2, 15);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: patientEmail,
      password: patientPassword,
      user_metadata: { name, age, phone, type: 'patient', psychologistId: inviteData.psychologistId },
      email_confirm: true
    });

    if (authError) {
      console.error('Patient signup auth error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store patient data
    const patientData = {
      id: authData.user.id,
      name,
      age,
      phone,
      psychologistId: inviteData.psychologistId,
      createdAt: new Date().toISOString(),
      credentials: { email: patientEmail, password: patientPassword }
    };

    await kv.set(`patient:${authData.user.id}`, patientData);

    // Add patient to psychologist's list
    const psychologistPatients = await kv.get(`psychologist:${inviteData.psychologistId}:patients`) || [];
    psychologistPatients.push(authData.user.id);
    await kv.set(`psychologist:${inviteData.psychologistId}:patients`, psychologistPatients);

    // Mark invite as used
    await kv.set(`invite:${inviteCode}`, { ...inviteData, used: true });

    // Generate session token for auto-login
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: patientEmail,
      password: patientPassword
    });

    if (sessionError) {
      console.error('Patient auto-login error:', sessionError);
    }

    return c.json({ 
      success: true, 
      userId: authData.user.id,
      accessToken: sessionData?.session?.access_token,
      credentials: { email: patientEmail, password: patientPassword }
    });
  } catch (error) {
    console.error('Patient signup error:', error);
    return c.json({ error: 'Failed to create patient account' }, 500);
  }
});

// ============================================
// PSYCHOLOGIST ROUTES
// ============================================

// Generate invite code
app.post("/make-server-755493d1/psychologist/invite", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Generate 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Store invite code
    await kv.set(`invite:${code}`, {
      code,
      psychologistId: user.id,
      used: false,
      createdAt: new Date().toISOString()
    });

    return c.json({ code });
  } catch (error) {
    console.error('Error generating invite code:', error);
    return c.json({ error: 'Failed to generate invite code' }, 500);
  }
});

// Get psychologist's patients
app.get("/make-server-755493d1/psychologist/patients", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const patientIds = await kv.get(`psychologist:${user.id}:patients`) || [];
    const patients = await kv.mget(patientIds.map((id: string) => `patient:${id}`));

    return c.json({ patients: patients.filter(p => p !== null) });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return c.json({ error: 'Failed to fetch patients' }, 500);
  }
});

// Get psychologist data
app.get("/make-server-755493d1/psychologist/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const psychologist = await kv.get(`psychologist:${user.id}`);
    return c.json({ psychologist });
  } catch (error) {
    console.error('Error fetching psychologist:', error);
    return c.json({ error: 'Failed to fetch psychologist data' }, 500);
  }
});

// ============================================
// PATIENT ROUTES
// ============================================

// Validate invite code
app.post("/make-server-755493d1/patient/validate-invite", async (c) => {
  try {
    const { code } = await c.req.json();
    const inviteData = await kv.get(`invite:${code}`);

    if (!inviteData || inviteData.used) {
      return c.json({ valid: false, error: 'Invalid or already used code' }, 400);
    }

    return c.json({ valid: true });
  } catch (error) {
    console.error('Error validating invite:', error);
    return c.json({ error: 'Failed to validate invite code' }, 500);
  }
});

// Get patient data
app.get("/make-server-755493d1/patient/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const patient = await kv.get(`patient:${user.id}`);
    if (!patient) {
      return c.json({ error: 'Patient not found' }, 404);
    }

    // Get psychologist data
    const psychologist = await kv.get(`psychologist:${patient.psychologistId}`);

    return c.json({ patient, psychologist });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return c.json({ error: 'Failed to fetch patient data' }, 500);
  }
});

// ============================================
// CRISIS ROUTES
// ============================================

// Create crisis
app.post("/make-server-755493d1/crisis/create", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const patient = await kv.get(`patient:${user.id}`);
    if (!patient) {
      return c.json({ error: 'Patient not found' }, 404);
    }

    const crisisId = `crisis_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const crisis = {
      id: crisisId,
      patientId: user.id,
      patientName: patient.name,
      psychologistId: patient.psychologistId,
      timestamp: new Date().toISOString(),
      status: 'pending',
      notes: null
    };

    // Store crisis
    await kv.set(`crisis:${crisisId}`, crisis);

    // Add to patient's crises
    const patientCrises = await kv.get(`patient:${user.id}:crises`) || [];
    patientCrises.push(crisisId);
    await kv.set(`patient:${user.id}:crises`, patientCrises);

    // Add to psychologist's crises
    const psychologistCrises = await kv.get(`psychologist:${patient.psychologistId}:crises`) || [];
    psychologistCrises.push(crisisId);
    await kv.set(`psychologist:${patient.psychologistId}:crises`, psychologistCrises);

    return c.json({ crisis });
  } catch (error) {
    console.error('Error creating crisis:', error);
    return c.json({ error: 'Failed to create crisis' }, 500);
  }
});

// Update crisis status
app.put("/make-server-755493d1/crisis/:id/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const crisisId = c.req.param('id');
    const { status, notes } = await c.req.json();

    const crisis = await kv.get(`crisis:${crisisId}`);
    if (!crisis) {
      return c.json({ error: 'Crisis not found' }, 404);
    }

    // Update crisis
    const updatedCrisis = { ...crisis, status, notes: notes || crisis.notes };
    await kv.set(`crisis:${crisisId}`, updatedCrisis);

    return c.json({ crisis: updatedCrisis });
  } catch (error) {
    console.error('Error updating crisis:', error);
    return c.json({ error: 'Failed to update crisis' }, 500);
  }
});

// Get all crises for psychologist
app.get("/make-server-755493d1/psychologist/crises", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const crisisIds = await kv.get(`psychologist:${user.id}:crises`) || [];
    const crises = await kv.mget(crisisIds.map((id: string) => `crisis:${id}`));

    return c.json({ crises: crises.filter(c => c !== null) });
  } catch (error) {
    console.error('Error fetching crises:', error);
    return c.json({ error: 'Failed to fetch crises' }, 500);
  }
});

// Get patient's crises
app.get("/make-server-755493d1/patient/crises", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const crisisIds = await kv.get(`patient:${user.id}:crises`) || [];
    const crises = await kv.mget(crisisIds.map((id: string) => `crisis:${id}`));

    return c.json({ crises: crises.filter(c => c !== null) });
  } catch (error) {
    console.error('Error fetching crises:', error);
    return c.json({ error: 'Failed to fetch crises' }, 500);
  }
});

// ============================================
// CHAT ROUTES
// ============================================

// Send message
app.post("/make-server-755493d1/chat/message", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { text, recipientId } = await c.req.json();

    // Determine sender type and get sender data
    let senderData;
    let senderType;
    const patientData = await kv.get(`patient:${user.id}`);
    if (patientData) {
      senderData = patientData;
      senderType = 'patient';
    } else {
      senderData = await kv.get(`psychologist:${user.id}`);
      senderType = 'psychologist';
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const message = {
      id: messageId,
      senderId: user.id,
      senderName: senderData.name,
      senderType,
      recipientId,
      text,
      timestamp: new Date().toISOString()
    };

    // Store message
    await kv.set(`message:${messageId}`, message);

    // Create conversation ID (sorted to ensure consistency)
    const conversationId = [user.id, recipientId].sort().join(':');
    
    // Add to conversation
    const conversationMessages = await kv.get(`conversation:${conversationId}`) || [];
    conversationMessages.push(messageId);
    await kv.set(`conversation:${conversationId}`, conversationMessages);

    return c.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Get messages for conversation
app.get("/make-server-755493d1/chat/messages/:recipientId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const recipientId = c.req.param('recipientId');
    const conversationId = [user.id, recipientId].sort().join(':');
    
    const messageIds = await kv.get(`conversation:${conversationId}`) || [];
    const messages = await kv.mget(messageIds.map((id: string) => `message:${id}`));

    return c.json({ messages: messages.filter(m => m !== null) });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

Deno.serve(app.fetch);