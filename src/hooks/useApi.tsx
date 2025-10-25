import { useState, useEffect, useCallback } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-755493d1`;

export function useApi(accessToken: string | null) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken || publicAnonKey}`
  };

  // Psychologist APIs
  const generateInviteCode = async () => {
    const response = await fetch(`${API_URL}/psychologist/invite`, {
      method: 'POST',
      headers
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.code;
  };

  const getPatients = async () => {
    const response = await fetch(`${API_URL}/psychologist/patients`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.patients;
  };

  const getPsychologist = async () => {
    const response = await fetch(`${API_URL}/psychologist/me`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.psychologist;
  };

  const getPsychologistCrises = async () => {
    const response = await fetch(`${API_URL}/psychologist/crises`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.crises;
  };

  // Patient APIs
  const validateInviteCode = async (code: string) => {
    const response = await fetch(`${API_URL}/patient/validate-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ code })
    });
    const data = await response.json();
    return response.ok;
  };

  const getPatient = async () => {
    const response = await fetch(`${API_URL}/patient/me`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  };

  const getPatientCrises = async () => {
    const response = await fetch(`${API_URL}/patient/crises`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.crises;
  };

  // Crisis APIs
  const createCrisis = async () => {
    const response = await fetch(`${API_URL}/crisis/create`, {
      method: 'POST',
      headers
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.crisis;
  };

  const updateCrisisStatus = async (crisisId: string, status: string, notes?: string) => {
    const response = await fetch(`${API_URL}/crisis/${crisisId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status, notes })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.crisis;
  };

  // Chat APIs
  const sendMessage = async (text: string, recipientId: string) => {
    const response = await fetch(`${API_URL}/chat/message`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, recipientId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.message;
  };

  const getMessages = async (recipientId: string) => {
    const response = await fetch(`${API_URL}/chat/messages/${recipientId}`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.messages;
  };

  return {
    generateInviteCode,
    getPatients,
    getPsychologist,
    getPsychologistCrises,
    validateInviteCode,
    getPatient,
    getPatientCrises,
    createCrisis,
    updateCrisisStatus,
    sendMessage,
    getMessages
  };
}

// Hook for real-time chat polling
export function useChatMessages(accessToken: string | null, recipientId: string | null, enabled: boolean = true) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApi(accessToken);

  const fetchMessages = useCallback(async () => {
    if (!recipientId || !enabled) return;
    
    try {
      const fetchedMessages = await api.getMessages(recipientId);
      setMessages(fetchedMessages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  }, [recipientId, enabled]);

  useEffect(() => {
    fetchMessages();
    
    // Poll for new messages every 2 seconds
    if (enabled && recipientId) {
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [fetchMessages, enabled, recipientId]);

  const sendMessage = async (text: string) => {
    if (!recipientId) return;
    
    try {
      const newMessage = await api.sendMessage(text, recipientId);
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return { messages, loading, sendMessage, refresh: fetchMessages };
}