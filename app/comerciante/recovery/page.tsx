'use client';
import { Button, Card, Input } from '@/domains/comerciante/components/ui';
import { AlertCircle, ArrowLeft, Check, CheckCircle2, Eye, EyeOff, Key, Mail, RotateCcw, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import {
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
  requestPasswordReset,
  resetPassword,
  validatePasswordResetToken,
} from '@/domains/auth/passwordRecovery';

type RecoveryStep = 'request' | 'sent' | 'reset' | 'success' | 'invalid';

function RecoveryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<RecoveryStep>('request');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      validatePasswordResetToken(token)
        .then(valid => setStep(valid ? 'reset' : 'invalid'))
        .catch(() => setStep('invalid'));
    }
  }, [token]);

  const validateEmail = (val: string) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!val) { setEmailError('El correo es obligatorio'); return false; }
    if (!isEmail) { setEmailError('Ingresa un formato de correo válido'); return false; }
    setEmailError(''); return true;
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setStep('sent');
    } catch (requestError) {
      setEmailError(requestError instanceof Error ? requestError.message : 'No se pudo enviar el correo.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setStep('invalid'); return; }
    if (!isStrongPassword(password)) { setPassError(PASSWORD_REQUIREMENTS_MESSAGE); return; }
    if (password !== confirmPassword) { setPassError('Las contraseñas no coinciden'); return; }
    setLoading(true);
    setPassError('');
    try {
      await resetPassword(token, password);
      setStep('success');
    } catch (resetError) {
      setPassError(resetError instanceof Error ? resetError.message : 'No se pudo cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'request': return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="space-y-3 text-center"><h1 className="text-[32px] font-extrabold tracking-tight leading-none">¿Olvidaste tu contraseña?</h1><p className="text-[14px] text-brand-text-muted font-medium">Ingresa tu correo administrativo para que podamos enviarte un enlace de recuperación.</p></header>
          <form onSubmit={handleRequest} className="space-y-6">
            <Input type="email" label="Correo electrónico" placeholder="ejemplo@plataforma.com" value={email} onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }} onBlur={(e) => validateEmail(e.target.value)} error={emailError} />
            <div className="flex flex-col gap-3">
              <Button type="submit" size="lg" disabled={loading} className="h-14 font-extrabold text-[15px] gap-3">{loading ? 'Enviando...' : 'Enviar enlace'} <Mail size={18} /></Button>
              <Button type="button" variant="ghost" size="lg" className="h-14 gap-2" onClick={() => router.push('/comerciante/login')}><ArrowLeft size={18} /> Cancelar y volver</Button>
            </div>
          </form>
        </div>
      );
      case 'sent': return (
        <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-50 border border-green-100 rounded-3xl flex items-center justify-center mx-auto text-green-600"><CheckCircle2 size={40} strokeWidth={2.5} /></div>
          <header className="space-y-3"><h1 className="text-[32px] font-extrabold tracking-tight leading-none">Correo enviado</h1><p className="text-[14px] text-brand-text-muted font-medium">Hemos enviado instrucciones a <strong>{email}</strong>. Por favor, revisa tu bandeja de entrada y carpeta de spam.</p></header>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="h-14 font-extrabold text-[15px] gap-2" onClick={() => router.push('/comerciante/login')}>Volver al inicio de sesión</Button>
            <button className="text-[13px] font-extrabold text-brand-camel hover:underline transition-all flex items-center justify-center gap-2 mt-4" onClick={() => setStep('request')}><RotateCcw size={14} /> ¿No recibiste el correo? Reenviar</button>
          </div>
        </div>
      );
      case 'reset': return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="space-y-3 text-center"><h1 className="text-[32px] font-extrabold tracking-tight leading-none">Crear nueva contraseña</h1><p className="text-[14px] text-brand-text-muted font-medium">Define una contraseña segura que sea fácil de recordar para ti pero difícil de adivinar.</p></header>
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} label="Nueva contraseña" placeholder="Min. 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-10 text-brand-text-muted hover:text-brand-black transition-colors">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              <Input type={showPass ? 'text' : 'password'} label="Confirmar contraseña" placeholder="Repite la contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={passError} />
            </div>
            <div className="bg-brand-neutral-light border border-brand-neutral-border rounded-xl p-5 space-y-3">
              <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest leading-none">Tu contraseña debe cumplir</p>
              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-[12px] font-bold ${password.length >= 8 ? 'text-green-600' : 'text-brand-text-muted'}`}>{password.length >= 8 ? <Check size={14} strokeWidth={3} /> : <AlertCircle size={14} />} Mínimo 8 caracteres</div>
                <div className={`flex items-center gap-2 text-[12px] font-bold ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-brand-text-muted'}`}>{/[A-Z]/.test(password) ? <Check size={14} strokeWidth={3} /> : <AlertCircle size={14} />} Al menos una mayúscula</div>
                <div className={`flex items-center gap-2 text-[12px] font-bold ${/[0-9]/.test(password) ? 'text-green-600' : 'text-brand-text-muted'}`}>{/[0-9]/.test(password) ? <Check size={14} strokeWidth={3} /> : <AlertCircle size={14} />} Al menos un número</div>
                <div className={`flex items-center gap-2 text-[12px] font-bold ${/[a-z]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-brand-text-muted'}`}>{/[a-z]/.test(password) && /[^A-Za-z0-9]/.test(password) ? <Check size={14} strokeWidth={3} /> : <AlertCircle size={14} />} Minúscula y símbolo</div>
              </div>
            </div>
            <Button type="submit" size="lg" disabled={loading} className="h-14 font-extrabold text-[15px] gap-3 w-full">{loading ? 'Guardando...' : 'Guardar contraseña'} <Key size={18} /></Button>
          </form>
        </div>
      );
      case 'success': return (
        <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-50 border border-green-100 rounded-3xl flex items-center justify-center mx-auto text-green-600 shadow-xl shadow-green-100/50"><CheckCircle2 size={40} strokeWidth={2.5} /></div>
          <header className="space-y-3"><h1 className="text-[32px] font-extrabold tracking-tight leading-none">¡Recuperación exitosa!</h1><p className="text-[14px] text-brand-text-muted font-medium">Tu contraseña ha sido actualizada correctamente. Ahora puedes volver a entrar al sistema.</p></header>
          <Button size="lg" className="h-14 font-extrabold text-[15px] w-full" onClick={() => router.push('/comerciante/login')}>Ir al inicio de sesión</Button>
        </div>
      );
      case 'invalid': return (
        <div className="space-y-8 text-center animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mx-auto text-red-600"><XCircle size={40} strokeWidth={2.5} /></div>
          <header className="space-y-3"><h1 className="text-[32px] font-extrabold tracking-tight leading-none">Enlace inválido o expirado</h1><p className="text-[14px] text-brand-text-muted font-medium">Por motivos de seguridad, los enlaces tienen una validez de 30 minutos y un solo uso.</p></header>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-left">
            <h5 className="text-[12px] font-extrabold text-red-700 mb-2">Posibles motivos:</h5>
            <ul className="text-[12px] text-red-600 space-y-1 list-disc pl-4 font-medium">
              <li>El tiempo de validez ha expirado.</li><li>Ya utilizaste este enlace para cambiar tu contraseña.</li><li>Hiciste una nueva solicitud que invalidó esta anterior.</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="h-14 font-extrabold text-[15px] w-full" onClick={() => setStep('request')}>Solicitar nuevo enlace</Button>
            <Button variant="ghost" size="lg" className="h-14 w-full" onClick={() => router.push('/comerciante/login')}>Volver al login</Button>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-neutral-light flex items-center justify-center p-6 selection:bg-brand-camel selection:text-white">
      <Card className="w-full max-w-[540px] p-12 !rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-camel/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-black/5 rounded-full blur-3xl -ml-16 -mb-16"></div>
        {renderContent()}
      </Card>
    </div>
  );
}

export default function RecoveryPage() {
  return (
    <Suspense fallback={null}>
      <RecoveryPageContent />
    </Suspense>
  );
}
