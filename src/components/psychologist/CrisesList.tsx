import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Heart, ArrowLeft, AlertCircle, MessageCircle } from 'lucide-react';
import { Crisis } from '../../types';

interface CrisesListProps {
  crises: Crisis[];
  onBack: () => void;
  onChat: (patientId: string) => void;
  onUpdateStatus: (crisisId: string, status: Crisis['status']) => void;
}

export function CrisesList({ crises, onBack, onChat, onUpdateStatus }: CrisesListProps) {
  const activeCrises = crises.filter(c => c.status !== 'resolved');
  const resolvedCrises = crises.filter(c => c.status === 'resolved');

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
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return `${days}d atrás`;
    }
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
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
              <AlertCircle className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">Painel de Crises</h1>
              <p className="text-sm text-gray-600">Alertas em tempo real</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Active Crises */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Crises Ativas</CardTitle>
                <CardDescription>Pacientes que precisam de atenção imediata</CardDescription>
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                {activeCrises.length} ativa{activeCrises.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {activeCrises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="size-12 mx-auto mb-4 opacity-30" />
                <p>Nenhuma crise ativa no momento.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeCrises.map((crisis) => (
                  <div
                    key={crisis.id}
                    className="p-4 border rounded-lg bg-white space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{crisis.patientName}</h3>
                        <p className="text-sm text-gray-600">{formatDate(crisis.timestamp)}</p>
                      </div>
                      <Badge className={getStatusColor(crisis.status)}>
                        {getStatusText(crisis.status)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onChat(crisis.patientId)}
                        className="flex-1"
                      >
                        <MessageCircle className="size-4 mr-2" />
                        Abrir Chat
                      </Button>
                      {crisis.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateStatus(crisis.id, 'in-progress')}
                          className="flex-1 bg-blue-500 hover:bg-blue-600"
                        >
                          Marcar como Em Atendimento
                        </Button>
                      )}
                      {crisis.status === 'in-progress' && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateStatus(crisis.id, 'resolved')}
                          className="flex-1 bg-green-500 hover:bg-green-600"
                        >
                          Marcar como Resolvida
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resolved Crises */}
        {resolvedCrises.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Crises Resolvidas</CardTitle>
              <CardDescription>Histórico recente de crises finalizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resolvedCrises.map((crisis) => (
                  <div
                    key={crisis.id}
                    className="p-4 border rounded-lg bg-gray-50 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-700">{crisis.patientName}</h3>
                        <p className="text-sm text-gray-500">{formatDate(crisis.timestamp)}</p>
                      </div>
                      <Badge className={getStatusColor(crisis.status)}>
                        {getStatusText(crisis.status)}
                      </Badge>
                    </div>
                    {crisis.notes && (
                      <p className="text-sm text-gray-600">{crisis.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
