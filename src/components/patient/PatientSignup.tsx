import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Heart } from 'lucide-react';

interface PatientSignupProps {
  inviteCode: string;
  onSignup: (name: string, age: number, phone: string) => Promise<boolean>;
}

export function PatientSignup({ inviteCode, onSignup }: PatientSignupProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSignup(name, parseInt(age), phone);
    setLoading(false);
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
          <CardTitle className="text-2xl">Complete seu Cadastro</CardTitle>
          <CardDescription>
            Código validado com sucesso! Agora complete seus dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-700">
              Código: <span className="font-medium">{inviteCode}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                placeholder="18"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Finalizar Cadastro'}
            </Button>
          </form>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Suas informações estão seguras</h3>
            <p className="text-sm text-gray-700">
              Seus dados serão compartilhados apenas com o profissional que enviou o convite.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}