import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Heart } from 'lucide-react';

interface PsychologistSignupProps {
  onSignup: () => void;
  onGoToLogin: () => void;
}

export function PsychologistSignup({ onSignup, onGoToLogin }: PsychologistSignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [crp, setCrp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      onSignup();
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
          <CardTitle className="text-2xl">Cadastro de Profissional</CardTitle>
          <CardDescription>
            Crie sua conta no MindCare Pro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Dr(a). Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crp">CRP</Label>
              <Input
                id="crp"
                type="text"
                placeholder="00/000000"
                value={crp}
                onChange={(e) => setCrp(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Cadastrar
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={onGoToLogin}
              className="text-sm text-blue-600 hover:underline"
            >
              Já tem conta? Faça login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
