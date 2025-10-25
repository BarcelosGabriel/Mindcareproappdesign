import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useApi } from './hooks/useApi';
import { toast } from 'sonner@2.0.3';

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
import { Toaster } from './components/ui/sonner';

type Screen =
  | 'psychologist-login'
  | 'psychologist-signup'
  | 'psychologist-dashboard'
  | 'psychologist-add-patient'
  | 'psychologist-patient-details'
  | 'psychologist-crises'
  | 'psychologist-chat'
  | 'patient-invite'
  | 'patient-signup'
  | 'patient-dashboard'
  | 'patient-crisis-activated'
  | 'patient-chat'
  | 'patient-history'
  | 'select-user-type'
  | 'loading';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [userType, setUserType] = useState<'psychologist' | 'patient' | null>(null);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  // Backend data
  const [psychologistData, setPsychologistData] = useState<any>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [crises, setCrises] = useState<any[]>([]);
  
  const { user, accessToken, loading: authLoading, psychologistSignup, psychologistLogin, patientSignup, logout } = useAuth();
  const api = useApi(accessToken);

  // Determine user type and load data
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setCurrentScreen('select-user-type');
      return;
    }

    // Load user data based on type
    const loadUserData = async () => {
      try {
        // Try to load as psychologist first
        try {
          const psych = await api.getPsychologist();
          if (psych) {
            setPsychologistData(psych);
            setUserType('psychologist');
            setCurrentScreen('psychologist-dashboard');
            loadPsychologistData();
            return;
          }
        } catch (e) {
          // Not a psychologist, try patient
        }

        // Try to load as patient
        try {
          const patientInfo = await api.getPatient();
          if (patientInfo.patient) {
            setPatientData(patientInfo.patient);
            setPsychologistData(patientInfo.psychologist);
            setUserType('patient');
            setCurrentScreen('patient-dashboard');
            loadPatientData();
            return;
          }
        } catch (e) {
          console.error('Error loading patient data:', e);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setCurrentScreen('select-user-type');
      }
    };

    loadUserData();
  }, [user, authLoading, accessToken]);

  const loadPsychologistData = async () => {
    try {
      const [patientsData, crisesData] = await Promise.all([
        api.getPatients(),
        api.getPsychologistCrises()
      ]);
      setPatients(patientsData || []);
      setCrises(crisesData || []);
    } catch (error) {
      console.error('Error loading psychologist data:', error);
      toast.error('Erro ao carregar dados');
    }
  };

  const loadPatientData = async () => {
    try {
      const crisesData = await api.getPatientCrises();
      setCrises(crisesData || []);
    } catch (error) {
      console.error('Error loading patient data:', error);
      toast.error('Erro ao carregar dados');
    }
  };

  const handleSelectUserType = (type: 'psychologist' | 'patient') => {
    setUserType(type);
    if (type === 'psychologist') {
      setCurrentScreen('psychologist-login');
    } else {
      setCurrentScreen('patient-invite');
    }
  };

  const handlePsychologistLogin = async (email: string, password: string) => {
    const result = await psychologistLogin(email, password);
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    toast.success('Login realizado com sucesso!');
    return true;
  };

  const handlePsychologistSignup = async (email: string, password: string, name: string, crp: string) => {
    const result = await psychologistSignup(email, password, name, crp);
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    toast.success('Cadastro realizado com sucesso!');
    return true;
  };

  const handleValidateInviteCode = async (code: string) => {
    const isValid = await api.validateInviteCode(code);
    if (!isValid) {
      toast.error('Código inválido ou já utilizado');
      return false;
    }
    setInviteCode(code);
    setCurrentScreen('patient-signup');
    return true;
  };

  const handlePatientSignup = async (name: string, age: number, phone: string) => {
    const result = await patientSignup(inviteCode, name, age, phone);
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    toast.success('Cadastro realizado com sucesso!');
    return true;
  };

  const handleActivateCrisis = async () => {
    try {
      const crisis = await api.createCrisis();
      setCrises(prev => [crisis, ...prev]);
      setCurrentScreen('patient-crisis-activated');
      toast.success('Seu psicólogo foi notificado');
    } catch (error) {
      console.error('Error creating crisis:', error);
      toast.error('Erro ao criar crise');
    }
  };

  const handleUpdateCrisisStatus = async (crisisId: string, status: string) => {
    try {
      const updatedCrisis = await api.updateCrisisStatus(crisisId, status);
      setCrises(prev => prev.map(c => c.id === crisisId ? updatedCrisis : c));
      toast.success('Status atualizado');
    } catch (error) {
      console.error('Error updating crisis:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserType(null);
    setPsychologistData(null);
    setPatientData(null);
    setPatients([]);
    setCrises([]);
    setCurrentScreen('select-user-type');
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const activeCrisesCount = crises.filter(c => c.status !== 'resolved').length;

  // Loading screen
  if (currentScreen === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="size-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Initial screen - select user type
  if (currentScreen === 'select-user-type') {
    return (
      <>
        <Toaster />
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
      </>
    );
  }

  // Psychologist Screens
  if (currentScreen === 'psychologist-login') {
    return (
      <>
        <Toaster />
        <PsychologistLogin
          onLogin={handlePsychologistLogin}
          onGoToSignup={() => setCurrentScreen('psychologist-signup')}
        />
      </>
    );
  }

  if (currentScreen === 'psychologist-signup') {
    return (
      <>
        <Toaster />
        <PsychologistSignup
          onSignup={handlePsychologistSignup}
          onGoToLogin={() => setCurrentScreen('psychologist-login')}
        />
      </>
    );
  }

  if (currentScreen === 'psychologist-dashboard') {
    return (
      <>
        <Toaster />
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
      </>
    );
  }

  if (currentScreen === 'psychologist-add-patient') {
    return (
      <>
        <Toaster />
        <AddPatient
          onBack={() => {
            setCurrentScreen('psychologist-dashboard');
            loadPsychologistData();
          }}
          accessToken={accessToken}
        />
      </>
    );
  }

  if (currentScreen === 'psychologist-patient-details' && selectedPatient) {
    const patientCrises = crises.filter(c => c.patientId === selectedPatient.id);
    return (
      <>
        <Toaster />
        <PatientDetails
          patient={selectedPatient}
          crises={patientCrises}
          onBack={() => setCurrentScreen('psychologist-dashboard')}
          onChat={(patientId) => {
            setSelectedPatientId(patientId);
            setCurrentScreen('psychologist-chat');
          }}
        />
      </>
    );
  }

  if (currentScreen === 'psychologist-crises') {
    return (
      <>
        <Toaster />
        <CrisesList
          crises={crises}
          onBack={() => setCurrentScreen('psychologist-dashboard')}
          onChat={(patientId) => {
            setSelectedPatientId(patientId);
            setCurrentScreen('psychologist-chat');
          }}
          onUpdateStatus={handleUpdateCrisisStatus}
        />
      </>
    );
  }

  if (currentScreen === 'psychologist-chat' && selectedPatient && user) {
    return (
      <>
        <Toaster />
        <ChatView
          currentUserId={user.id}
          currentUserName={psychologistData?.name || 'Psicólogo'}
          currentUserType="psychologist"
          otherUserId={selectedPatient.id}
          otherUserName={selectedPatient.name}
          accessToken={accessToken}
          onBack={() => setCurrentScreen('psychologist-dashboard')}
        />
      </>
    );
  }

  // Patient Screens
  if (currentScreen === 'patient-invite') {
    return (
      <>
        <Toaster />
        <PatientInviteCode
          onValidateCode={handleValidateInviteCode}
        />
      </>
    );
  }

  if (currentScreen === 'patient-signup') {
    return (
      <>
        <Toaster />
        <PatientSignup
          inviteCode={inviteCode}
          onSignup={handlePatientSignup}
        />
      </>
    );
  }

  if (currentScreen === 'patient-dashboard' && patientData) {
    return (
      <>
        <Toaster />
        <PatientDashboard
          patientName={patientData.name}
          psychologistName={psychologistData?.name || 'Seu psicólogo'}
          onCrisisClick={handleActivateCrisis}
          onChatClick={() => setCurrentScreen('patient-chat')}
          onHistoryClick={() => setCurrentScreen('patient-history')}
          onLogout={handleLogout}
        />
      </>
    );
  }

  if (currentScreen === 'patient-crisis-activated') {
    return (
      <>
        <Toaster />
        <CrisisActivated
          psychologistName={psychologistData?.name || 'Seu psicólogo'}
          onGoToChat={() => setCurrentScreen('patient-chat')}
        />
      </>
    );
  }

  if (currentScreen === 'patient-chat' && patientData && user) {
    return (
      <>
        <Toaster />
        <ChatView
          currentUserId={user.id}
          currentUserName={patientData.name}
          currentUserType="patient"
          otherUserId={patientData.psychologistId}
          otherUserName={psychologistData?.name || 'Psicólogo'}
          accessToken={accessToken}
          onBack={() => setCurrentScreen('patient-dashboard')}
        />
      </>
    );
  }

  if (currentScreen === 'patient-history' && patientData) {
    return (
      <>
        <Toaster />
        <PatientHistory
          crises={crises}
          onBack={() => setCurrentScreen('patient-dashboard')}
        />
      </>
    );
  }

  return null;
}
