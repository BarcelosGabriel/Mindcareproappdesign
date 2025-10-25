export type UserType = 'psychologist' | 'patient' | null;

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  emergencyContact: string;
  emotionalHistory: string;
  psychologistId: string;
  createdAt: Date;
}

export interface Crisis {
  id: string;
  patientId: string;
  patientName: string;
  timestamp: Date;
  status: 'pending' | 'in-progress' | 'resolved';
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'psychologist' | 'patient';
  text: string;
  timestamp: Date;
}

export interface InviteCode {
  code: string;
  psychologistId: string;
  patientName?: string;
  used: boolean;
}
