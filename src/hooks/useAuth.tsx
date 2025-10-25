import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-755493d1`;

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setAccessToken(session.access_token);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const psychologistSignup = async (email: string, password: string, name: string, crp: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/psychologist/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name, crp })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Now login
      const { data: sessionData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      setUser(sessionData.session?.user ?? null);
      setAccessToken(sessionData.session?.access_token ?? null);
      
      return { success: true };
    } catch (error: any) {
      console.error('Psychologist signup error:', error);
      return { error: error.message };
    }
  };

  const psychologistLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      setUser(data.session?.user ?? null);
      setAccessToken(data.session?.access_token ?? null);
      
      return { success: true };
    } catch (error: any) {
      console.error('Psychologist login error:', error);
      return { error: error.message };
    }
  };

  const patientSignup = async (inviteCode: string, name: string, age: number, phone: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/patient/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ inviteCode, name, age, phone })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Patient is auto-logged in - use the credentials to sign in
      if (data.credentials) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.credentials.email,
          password: data.credentials.password
        });
        
        if (error) {
          console.error('Patient auto-login error:', error);
        } else {
          // Get the updated session
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
            setUser(sessionData.session.user);
            setAccessToken(sessionData.session.access_token);
          }
        }
      }
      
      return { success: true, credentials: data.credentials };
    } catch (error: any) {
      console.error('Patient signup error:', error);
      return { error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
  };

  return {
    user,
    accessToken,
    loading,
    psychologistSignup,
    psychologistLogin,
    patientSignup,
    logout
  };
}