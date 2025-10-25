import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Heart, CheckCircle, Loader2 } from 'lucide-react';

interface CrisisActivatedProps {
  psychologistName: string;
  onGoToChat: () => void;
}

export function CrisisActivated({ psychologistName, onGoToChat }: CrisisActivatedProps) {
  const [isNotifying, setIsNotifying] = useState(true);

  useEffect(() => {
    // Simulate notification delay
    const timer = setTimeout(() => {
      setIsNotifying(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto redirect to chat after notification
    if (!isNotifying) {
      const redirectTimer = setTimeout(() => {
        onGoToChat();
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isNotifying, onGoToChat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-orange-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isNotifying ? (
              <div className="bg-orange-100 p-4 rounded-full animate-pulse">
                <Loader2 className="size-12 text-orange-500 animate-spin" />
              </div>
            ) : (
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="size-12 text-green-500" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {isNotifying ? 'Notificando seu psicólogo...' : 'Psicólogo notificado!'}
          </CardTitle>
          <CardDescription>
            {isNotifying
              ? 'Aguarde um momento...'
              : `${psychologistName} foi informado(a) e entrará em contato em breve`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isNotifying && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-700 mb-3">
                  Você será redirecionado(a) para o chat em alguns segundos...
                </p>
                <Button
                  onClick={onGoToChat}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Ir para o Chat Agora
                </Button>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-medium">Enquanto aguarda:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Respire profundamente</li>
                  <li>Encontre um lugar calmo</li>
                  <li>Prepare-se para conversar</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
