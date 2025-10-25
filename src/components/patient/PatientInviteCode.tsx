import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Heart } from 'lucide-react';

interface PatientInviteCodeProps {
  onValidateCode: (code: string) => void;
}

export function PatientInviteCode({ onValidateCode }: PatientInviteCodeProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length === 6) {
      onValidateCode(code.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-full">
              <Heart className="size-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">MindCare Pro</CardTitle>
          <CardDescription>
            Bem-vindo(a)! Insira o código de convite enviado pelo seu psicólogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Convite</Label>
              <Input
                id="code"
                type="text"
                placeholder="ABC123"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                required
              />
              <p className="text-xs text-gray-500 text-center">
                Digite o código de 6 caracteres
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={code.length !== 6}
            >
              Validar Código
            </Button>
          </form>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Não tem um código?</h3>
            <p className="text-sm text-gray-700">
              Entre em contato com seu psicólogo da saúde pública para receber um código de convite e começar seu acompanhamento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
