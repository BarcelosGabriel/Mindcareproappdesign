import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Heart, AlertCircle, MessageCircle, History, LogOut } from 'lucide-react';

interface PatientDashboardProps {
  patientName: string;
  psychologistName: string;
  onCrisisClick: () => void;
  onChatClick: () => void;
  onHistoryClick: () => void;
  onLogout: () => void;
}

export function PatientDashboard({
  patientName,
  psychologistName,
  onCrisisClick,
  onChatClick,
  onHistoryClick,
  onLogout
}: PatientDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
              <Heart className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">MindCare Pro</h1>
              <p className="text-sm text-gray-600">Olá, {patientName}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout}>
            <LogOut className="size-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome Card */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>Bem-vindo(a) ao seu espaço</CardTitle>
            <CardDescription>
              Você está conectado(a) com {psychologistName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Este é um espaço seguro para você. Em momentos de crise emocional, seu psicólogo estará disponível para te apoiar.
            </p>
          </CardContent>
        </Card>

        {/* Crisis Button */}
        <Card className="border-orange-300 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="text-center">
            <AlertCircle className="size-16 mx-auto text-orange-500 mb-4" />
            <CardTitle className="text-2xl">Precisa de ajuda agora?</CardTitle>
            <CardDescription>
              Ao acionar este botão, seu psicólogo será notificado imediatamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={onCrisisClick}
              className="w-full h-16 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <AlertCircle className="size-6 mr-3" />
              Estou em Crise
            </Button>
            <p className="text-xs text-center mt-3 text-gray-600">
              Você será conectado(a) ao chat automaticamente
            </p>
          </CardContent>
        </Card>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onChatClick}>
            <CardHeader>
              <MessageCircle className="size-8 text-blue-500 mb-2" />
              <CardTitle>Chat</CardTitle>
              <CardDescription>
                Converse com seu psicólogo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Abrir Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onHistoryClick}>
            <CardHeader>
              <History className="size-8 text-purple-500 mb-2" />
              <CardTitle>Histórico</CardTitle>
              <CardDescription>
                Veja suas crises anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Histórico
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Info */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Em caso de emergência grave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-red-700">
              Se você está em risco imediato, ligue:
            </p>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">SAMU:</span> 192</p>
              <p><span className="font-medium">CVV:</span> 188 (24h)</p>
              <p><span className="font-medium">Bombeiros:</span> 193</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
