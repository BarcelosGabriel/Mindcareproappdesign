import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Heart, Copy, ArrowLeft, Check } from 'lucide-react';
import { useApi } from '../../hooks/useApi';

interface AddPatientProps {
  onBack: () => void;
  accessToken: string | null;
}

export function AddPatient({ onBack, accessToken }: AddPatientProps) {
  const [inviteCode, setInviteCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const api = useApi(accessToken);

  useEffect(() => {
    // Generate invite code on mount
    const generateCode = async () => {
      try {
        const code = await api.generateInviteCode();
        setInviteCode(code);
      } catch (error) {
        console.error('Error generating code:', error);
      } finally {
        setLoading(false);
      }
    };
    generateCode();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="size-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Gerando código...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl">Adicionar Paciente</h1>
              <p className="text-sm text-gray-600">Gerar código de convite</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Código de Convite Gerado</CardTitle>
            <CardDescription>
              Compartilhe este código com seu paciente para que ele possa se cadastrar no aplicativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Código de Convite</p>
              <p className="text-5xl tracking-wider mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {inviteCode}
              </p>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="bg-white"
              >
                {copied ? (
                  <>
                    <Check className="size-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="size-4 mr-2" />
                    Copiar Código
                  </>
                )}
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">Como funciona?</h3>
              <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                <li>Compartilhe este código com seu paciente</li>
                <li>O paciente deve acessar o aplicativo e inserir o código</li>
                <li>Após validar o código, o paciente completará o cadastro</li>
                <li>O paciente aparecerá automaticamente na sua lista</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onBack}>
                Voltar
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={onBack}
              >
                Concluir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}