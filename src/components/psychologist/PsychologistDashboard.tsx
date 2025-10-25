import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Heart, UserPlus, AlertCircle, LogOut, Users } from 'lucide-react';
import { Patient } from '../../types';

interface PsychologistDashboardProps {
  patients: Patient[];
  onAddPatient: () => void;
  onViewPatient: (patientId: string) => void;
  onViewCrises: () => void;
  onLogout: () => void;
  activeCrisesCount: number;
}

export function PsychologistDashboard({
  patients,
  onAddPatient,
  onViewPatient,
  onViewCrises,
  onLogout,
  activeCrisesCount
}: PsychologistDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
              <Heart className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">MindCare Pro</h1>
              <p className="text-sm text-gray-600">Painel do Profissional</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout}>
            <LogOut className="size-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Pacientes</CardDescription>
              <CardTitle className="text-3xl">{patients.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <Users className="size-8 text-blue-500 opacity-50" />
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardDescription>Crises Ativas</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{activeCrisesCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                onClick={onViewCrises}
              >
                <AlertCircle className="size-4 mr-2" />
                Ver Crises
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardDescription>Adicionar Paciente</CardDescription>
              <CardTitle className="text-sm">Gerar código de convite</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={onAddPatient}
              >
                <UserPlus className="size-4 mr-2" />
                Novo Paciente
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Pacientes</CardTitle>
            <CardDescription>
              Lista de todos os pacientes cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="size-12 mx-auto mb-4 opacity-30" />
                <p>Nenhum paciente cadastrado ainda.</p>
                <p className="text-sm">Clique em "Novo Paciente" para começar.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onViewPatient(patient.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-blue-100 to-purple-100 size-12 rounded-full flex items-center justify-center">
                        <span className="text-lg text-blue-600">
                          {patient.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-sm text-gray-600">
                          {patient.age} anos • {patient.phone}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Ver detalhes</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
