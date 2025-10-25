import { useState } from 'react';
import { UserType, Patient, Crisis, Message } from './types';
import { mockPatients, mockCrises, mockMessages } from './data/mockData';

// Psychologist Components
import { PsychologistLogin } from './components/psychologist/PsychologistLogin';
import { PsychologistSignup } from './components/psychologist/PsychologistSignup';
import { PsychologistDashboard } from './components/psychologist/PsychologistDashboard';
import { AddPatient } from './components/psychologist/AddPatient';
import { PatientDetails } from './components/psychologist/PatientDetails';
import { CrisesList } from './components/psychologist/CrisesList';

// Patient Components
import { PatientInviteCode } from './components/patient/PatientInviteCode';
import { PatientSignup } from './components/patient/PatientSignup';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { CrisisActivated } from './components/patient/CrisisActivated';
import { PatientHistory } from './components/patient/PatientHistory';

// Shared Components
import { ChatView } from './components/shared/ChatView';

type Screen =
  // Psychologist Screens
  | 'psychologist-login'
  | 'psychologist-signup'
  | 'psychologist-dashboard'
  | 'psychologist-add-patient'
  | 'psychologist-patient-details'
  | 'psychologist-crises'
  | 'psychologist-chat'
  // Patient Screens
  | 'patient-invite'
  | 'patient-signup'
  | 'patient-dashboard'
  | 'patient-crisis-activated'
  | 'patient-chat'
  | 'patient-history'
  // Initial
  | 'select-user-type';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('select-user-type');
  const [userType, setUserType] = useState<UserType>(null);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [crises, setCrises] = useState<Crisis[]>(mockCrises);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string>('');

  // Mock data
  const currentPsychologistName = 'Dr. Paulo Mendes';
  const currentPatientName = 'Ana Silva';

  const handleSelectUserType = (type: 'psychologist' | 'patient') => {
    setUserType(type);
    if (type === 'psychologist') {
      setCurrentScreen('psychologist-login');
    } else {
      setCurrentScreen('patient-invite');
    }
  };

  const handlePsychologistLogin = () => {
    setCurrentScreen('psychologist-dashboard');
  };

  const handlePsychologistSignup = () => {
    setCurrentScreen('psychologist-dashboard');
  };

  const handleValidateInviteCode = (code: string) => {
    setInviteCode(code);
    setCurrentScreen('patient-signup');
  };

  const handlePatientSignup = () => {
    setCurrentScreen('patient-dashboard');
  };

  const handleActivateCrisis = () => {
    // Create new crisis
    const newCrisis: Crisis = {
      id: `c${crises.length + 1}`,
      patientId: '1',
      patientName: currentPatientName,
      timestamp: new Date(),
      status: 'pending'
    };
    setCrises([newCrisis, ...crises]);
    setCurrentScreen('patient-crisis-activated');
  };

  const handleUpdateCrisisStatus = (crisisId: string, status: Crisis['status']) => {
    setCrises(crises.map(c => c.id === crisisId ? { ...c, status } : c));
  };

  const handleSendMessage = (text: string, senderId: string, senderName: string, senderType: 'psychologist' | 'patient') => {
    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      senderId,
      senderName,
      senderType,
      text,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
  };

  const handleLogout = () => {
    setCurrentScreen('select-user-type');
    setUserType(null);
    setSelectedPatientId(null);
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const activeCrisesCount = crises.filter(c => c.status !== 'resolved').length;

  // Initial screen - select user type
  if (currentScreen === 'select-user-type') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-full">
                <svg className="size-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MindCare Pro
            </h1>
            <p className="text-gray-600 text-lg">
              Conectando psicólogos e pacientes em momentos de crise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => handleSelectUserType('psychologist')}
              className="bg-white border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-lg transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 size-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="size-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl mb-2">Sou Profissional</h2>
              <p className="text-gray-600">
                Acesse como psicólogo da saúde pública para gerenciar seus pacientes
              </p>
            </button>

            <button
              onClick={() => handleSelectUserType('patient')}
              className="bg-white border-2 border-purple-200 rounded-2xl p-8 hover:border-purple-400 hover:shadow-lg transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 size-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="size-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl mb-2">Sou Paciente</h2>
              <p className="text-gray-600">
                Acesse com seu código de convite para conectar-se com seu psicólogo
              </p>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Nota importante:</span> Este aplicativo é destinado ao acompanhamento de pacientes da saúde pública. 
              Em caso de emergência grave, ligue 192 (SAMU) ou 188 (CVV).
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Psychologist Screens
  if (currentScreen === 'psychologist-login') {
    return (
      <PsychologistLogin
        onLogin={handlePsychologistLogin}
        onGoToSignup={() => setCurrentScreen('psychologist-signup')}
      />
    );
  }

  if (currentScreen === 'psychologist-signup') {
    return (
      <PsychologistSignup
        onSignup={handlePsychologistSignup}
        onGoToLogin={() => setCurrentScreen('psychologist-login')}
      />
    );
  }

  if (currentScreen === 'psychologist-dashboard') {
    return (
      <PsychologistDashboard
        patients={patients}
        onAddPatient={() => setCurrentScreen('psychologist-add-patient')}
        onViewPatient={(patientId) => {
          setSelectedPatientId(patientId);
          setCurrentScreen('psychologist-patient-details');
        }}
        onViewCrises={() => setCurrentScreen('psychologist-crises')}
        onLogout={handleLogout}
        activeCrisesCount={activeCrisesCount}
      />
    );
  }

  if (currentScreen === 'psychologist-add-patient') {
    return (
      <AddPatient
        onBack={() => setCurrentScreen('psychologist-dashboard')}
      />
    );
  }

  if (currentScreen === 'psychologist-patient-details' && selectedPatient) {
    return (
      <PatientDetails
        patient={selectedPatient}
        crises={crises}
        onBack={() => setCurrentScreen('psychologist-dashboard')}
        onChat={(patientId) => {
          setSelectedPatientId(patientId);
          setCurrentScreen('psychologist-chat');
        }}
      />
    );
  }

  if (currentScreen === 'psychologist-crises') {
    return (
      <CrisesList
        crises={crises}
        onBack={() => setCurrentScreen('psychologist-dashboard')}
        onChat={(patientId) => {
          setSelectedPatientId(patientId);
          setCurrentScreen('psychologist-chat');
        }}
        onUpdateStatus={handleUpdateCrisisStatus}
      />
    );
  }

  if (currentScreen === 'psychologist-chat' && selectedPatient) {
    return (
      <ChatView
        currentUserId="psy1"
        currentUserName={currentPsychologistName}
        currentUserType="psychologist"
        otherUserName={selectedPatient.name}
        messages={messages}
        onBack={() => setCurrentScreen('psychologist-dashboard')}
        onSendMessage={(text) =>
          handleSendMessage(text, 'psy1', currentPsychologistName, 'psychologist')
        }
      />
    );
  }

  // Patient Screens
  if (currentScreen === 'patient-invite') {
    return (
      <PatientInviteCode
        onValidateCode={handleValidateInviteCode}
      />
    );
  }

  if (currentScreen === 'patient-signup') {
    return (
      <PatientSignup
        inviteCode={inviteCode}
        onSignup={handlePatientSignup}
      />
    );
  }

  if (currentScreen === 'patient-dashboard') {
    return (
      <PatientDashboard
        patientName={currentPatientName}
        psychologistName={currentPsychologistName}
        onCrisisClick={handleActivateCrisis}
        onChatClick={() => setCurrentScreen('patient-chat')}
        onHistoryClick={() => setCurrentScreen('patient-history')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'patient-crisis-activated') {
    return (
      <CrisisActivated
        psychologistName={currentPsychologistName}
        onGoToChat={() => setCurrentScreen('patient-chat')}
      />
    );
  }

  if (currentScreen === 'patient-chat') {
    return (
      <ChatView
        currentUserId="1"
        currentUserName={currentPatientName}
        currentUserType="patient"
        otherUserName={currentPsychologistName}
        messages={messages}
        onBack={() => setCurrentScreen('patient-dashboard')}
        onSendMessage={(text) =>
          handleSendMessage(text, '1', currentPatientName, 'patient')
        }
      />
    );
  }

  if (currentScreen === 'patient-history') {
    return (
      <PatientHistory
        crises={crises.filter(c => c.patientId === '1')}
        onBack={() => setCurrentScreen('patient-dashboard')}
      />
    );
  }

  return null;
}
