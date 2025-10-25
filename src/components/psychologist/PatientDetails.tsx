import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Heart, ArrowLeft, Phone, User, Calendar, FileText, MessageCircle } from 'lucide-react';
import { Patient, Crisis } from '../../types';

interface PatientDetailsProps {
  patient: Patient;
  crises: Crisis[];
  onBack: () => void;
  onChat: (patientId: string) => void;
}

export function PatientDetails({ patient, crises, onBack, onChat }: PatientDetailsProps) {
  const patientCrises = crises.filter(c => c.patientId === patient.id);

  const getStatusColor = (status: Crisis['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusText = (status: Crisis['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in-progress':
        return 'Em Atendimento';
      case 'resolved':
        return 'Resolvida';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
              <Heart className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">Detalhes do Paciente</h1>
              <p className="text-sm text-gray-600">{patient.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Patient Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Informações do Paciente</CardTitle>
                <CardDescription>Dados cadastrais e contato</CardDescription>
              </div>
              <Button
                onClick={() => onChat(patient.id)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <MessageCircle className="size-4 mr-2" />
                Iniciar Chat
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="size-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium">{patient.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Idade</p>
                  <p className="font-medium">{patient.age} anos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Contato de Emergência</p>
                  <p className="font-medium">{patient.emergencyContact}</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 pt-4 border-t">
              <FileText className="size-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Histórico Emocional</p>
                <p className="text-sm">{patient.emotionalHistory}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crisis History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Crises</CardTitle>
            <CardDescription>
              Registro de todas as crises acionadas pelo paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {patientCrises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma crise registrada ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {patientCrises.map((crisis) => (
                  <div
                    key={crisis.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(crisis.status)}>
                          {getStatusText(crisis.status)}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {formatDate(crisis.timestamp)}
                        </span>
                      </div>
                      {crisis.notes && (
                        <p className="text-sm text-gray-700">{crisis.notes}</p>
                      )}
                    </div>
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
