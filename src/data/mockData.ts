import { Patient, Crisis, Message } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Ana Silva',
    age: 28,
    phone: '(11) 98765-4321',
    emergencyContact: '(11) 91234-5678 - Mãe',
    emotionalHistory: 'Ansiedade generalizada. Acompanhamento desde março/2024.',
    psychologistId: 'psy1',
    createdAt: new Date('2024-03-15')
  },
  {
    id: '2',
    name: 'Carlos Santos',
    age: 35,
    phone: '(21) 97654-3210',
    emergencyContact: '(21) 96543-2109 - Esposa',
    emotionalHistory: 'Depressão moderada. Em tratamento medicamentoso.',
    psychologistId: 'psy1',
    createdAt: new Date('2024-05-20')
  },
  {
    id: '3',
    name: 'Mariana Costa',
    age: 22,
    phone: '(85) 99876-5432',
    emergencyContact: '(85) 98765-4321 - Pai',
    emotionalHistory: 'Síndrome do pânico. Primeira crise em janeiro/2024.',
    psychologistId: 'psy1',
    createdAt: new Date('2024-02-10')
  }
];

export const mockCrises: Crisis[] = [
  {
    id: 'c1',
    patientId: '1',
    patientName: 'Ana Silva',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    status: 'pending'
  },
  {
    id: 'c2',
    patientId: '3',
    patientName: 'Mariana Costa',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'in-progress'
  },
  {
    id: 'c3',
    patientId: '2',
    patientName: 'Carlos Santos',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'resolved',
    notes: 'Paciente acalmado após conversa de 30 minutos.'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: '1',
    senderName: 'Ana Silva',
    senderType: 'patient',
    text: 'Olá, estou me sentindo muito ansiosa...',
    timestamp: new Date(Date.now() - 1000 * 60 * 10)
  },
  {
    id: 'm2',
    senderId: 'psy1',
    senderName: 'Dr. Paulo',
    senderType: 'psychologist',
    text: 'Olá Ana, estou aqui. Pode me contar o que está sentindo?',
    timestamp: new Date(Date.now() - 1000 * 60 * 9)
  },
  {
    id: 'm3',
    senderId: '1',
    senderName: 'Ana Silva',
    senderType: 'patient',
    text: 'Estou com taquicardia e sensação de falta de ar.',
    timestamp: new Date(Date.now() - 1000 * 60 * 8)
  }
];
