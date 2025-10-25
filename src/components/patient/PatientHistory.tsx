import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Heart, ArrowLeft, History } from 'lucide-react';
import { Crisis } from '../../types';

interface PatientHistoryProps {
  crises: Crisis[];
  onBack: () => void;
}

export function PatientHistory({ crises, onBack }: PatientHistoryProps) {
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
        return 'Aguardando';
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
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <History className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">Histórico de Crises</h1>
              <p className="text-sm text-gray-600">Seu acompanhamento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Suas Crises Registradas</CardTitle>
            <CardDescription>
              Histórico completo de momentos em que você solicitou apoio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {crises.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <History className="size-12 mx-auto mb-4 opacity-30" />
                <p>Nenhuma crise registrada ainda.</p>
                <p className="text-sm mt-2">
                  Quando você acionar o botão "Estou em Crise", o registro aparecerá aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {crises
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((crisis) => (
                    <div
                      key={crisis.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getStatusColor(crisis.status)}>
                              {getStatusText(crisis.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDate(crisis.timestamp)}
                          </p>
                        </div>
                      </div>
                      {crisis.notes && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Observações do profissional:
                          </p>
                          <p className="text-sm text-gray-600">{crisis.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium mb-2">Sobre o histórico</h3>
          <p className="text-sm text-gray-700">
            Este histórico é compartilhado com seu psicólogo e ajuda no acompanhamento do seu tratamento. 
            Todas as informações são confidenciais e protegidas.
          </p>
        </div>
      </div>
    </div>
  );
}
