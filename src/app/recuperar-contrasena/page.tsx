'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/UI';
import { ArrowLeft, Mail, KeyRound, Lock, CheckCircle2 } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

const STEP_LABELS = ['Correo', 'Verificación', 'Nueva contraseña'];
const MOCK_VALID_CODE = '123456';

export default function RecuperarContrasenaPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const [email,        setEmail]        = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [code,         setCode]         = useState('');
  const [codeTouched,  setCodeTouched]  = useState(false);
  const [codeError,    setCodeError]    = useState('');
  const [newPass,      setNewPass]      = useState('');
  const [confPass,     setConfPass]     = useState('');
  const [newPassTouched,  setNewPassTouched]  = useState(false);
  const [confPassTouched, setConfPassTouched] = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const emailErr = (() => {
    if (!emailTouched) return '';
    if (!email) return 'El correo es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un correo válido.';
    return '';
  })();

  const newPassErr = (() => {
    if (!newPassTouched) return '';
    if (!newPass) return 'La contraseña es obligatoria.';
    if (newPass.length < 8) return 'Mínimo 8 caracteres.';
    if (!/[A-Z]/.test(newPass)) return 'Debe incluir al menos una mayúscula.';
    if (!/[0-9]/.test(newPass)) return 'Debe incluir al menos un número.';
    return '';
  })();

  const confPassErr = (() => {
    if (!confPassTouched) return '';
    if (!confPass) return 'Confirma tu contraseña.';
    if (confPass !== newPass) return 'Las contraseñas no coinciden.';
    return '';
  })();

  const step1Valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const step2Valid = code.length === 6;
  const step3Valid = newPass.length >= 8 && /[A-Z]/.test(newPass) && /[0-9]/.test(newPass) && confPass === newPass;

  const progressPercent = step === 4 ? 100 : ((step - 1) / 3) * 100;

  const handleStep1 = () => {
    setEmailTouched(true);
    if (!step1Valid) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 900);
  };

  const handleStep2 = () => {
    setCodeTouched(true);
    if (!step2Valid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code !== MOCK_VALID_CODE) setCodeError('Código incorrecto. Verifica el correo e inténtalo de nuevo.');
      else { setCodeError(''); setStep(3); }
    }, 900);
  };

  const handleStep3 = () => {
    setNewPassTouched(true);
    setConfPassTouched(true);
    if (!step3Valid) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(4); }, 900);
  };

  return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <div className="w-full max-w-[900px] bg-white rounded-[32px] shadow-sm border border-neutral-100 overflow-hidden flex min-h-[520px]">

          {/* ── Panel izquierdo (negro) ── */}
          <div className="hidden md:flex w-[380px] shrink-0 bg-brand-black flex-col justify-between p-10 relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-[48px] bg-white/5" />
            <div className="absolute top-32 -right-20 w-56 h-56 rounded-[48px] bg-white/5" />
            <div className="absolute -bottom-10 left-10 w-48 h-48 rounded-[48px] bg-white/5" />
            <div className="absolute bottom-24 -right-10 w-40 h-40 rounded-[48px] bg-white/5" />

            <div className="relative z-10">
              <h1 className="text-[40px] font-display font-extrabold tracking-tighter text-white mb-4">
                Kingstore
              </h1>
              <p className="text-[15px] text-neutral-400 leading-relaxed">
                Recupera el acceso a tu cuenta de administrador en pocos pasos.
              </p>
            </div>

            <div className="relative z-10 flex gap-3">
            <span className="px-3 py-2 rounded-xl border border-white/10 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Multi-tenant
            </span>
              <span className="px-3 py-2 rounded-xl border border-white/10 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Streetwear DS
            </span>
            </div>
          </div>

          {/* ── Panel derecho ── */}
          <div className="flex-1 flex flex-col justify-center px-10 py-12">

            {step !== 4 && (
                <button
                    onClick={() => step === 1 ? router.push('/admin/login') : setStep(s => (s - 1) as Step)}
                    className="flex items-center gap-2 text-brand-camel font-bold text-[13px] mb-6 hover:underline w-fit"
                >
                  <ArrowLeft size={14} />
                  {step === 1 ? 'Volver al inicio de sesión' : 'Paso anterior'}
                </button>
            )}

            {step !== 4 && (
                <div className="mb-8">
                  <h2 className="text-[32px] font-display font-extrabold text-brand-black mb-1">
                    Recuperar contraseña
                  </h2>
                  <p className="text-[13px] text-neutral-400 mb-6">
                    {step === 1 && 'Ingresa tu correo y te enviaremos un código de verificación.'}
                    {step === 2 && `Ingresa el código de 6 dígitos enviado a ${email}.`}
                    {step === 3 && 'Elige una nueva contraseña segura para tu cuenta.'}
                  </p>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between mb-2">
                      {STEP_LABELS.map((label, i) => (
                          <span key={i} className={`text-[11px] font-bold uppercase tracking-wider ${
                              i + 1 < step ? 'text-brand-camel' : i + 1 === step ? 'text-brand-black' : 'text-neutral-300'
                          }`}>
                      {label}
                    </span>
                      ))}
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                          className="h-full bg-brand-camel rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
            )}

            {/* Paso 1 */}
            {step === 1 && (
                <div className="space-y-5">
                  <Input
                      label="Correo electrónico"
                      type="email"
                      placeholder="admin@plataforma.com"
                      icon={Mail}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      error={emailErr}
                  />
                  <button
                      onClick={handleStep1}
                      disabled={!step1Valid || loading}
                      className={`w-full h-12 rounded-xl font-bold text-[14px] flex items-center justify-center transition-all ${
                          step1Valid && !loading ? 'bg-brand-black text-white hover:bg-neutral-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                  >
                    {loading ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5" /> : 'Enviar código'}
                  </button>
                </div>
            )}

            {/* Paso 2 */}
            {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-neutral-500 uppercase ml-1">Código de verificación</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                          type="text"
                          maxLength={6}
                          placeholder="123456"
                          value={code}
                          onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setCodeError(''); }}
                          onBlur={() => setCodeTouched(true)}
                          className={`w-full pl-12 pr-4 py-3 bg-white border rounded-xl text-[20px] font-bold tracking-[0.3em] outline-none focus:border-brand-camel transition-colors text-center ${
                              codeError ? 'border-red-500' : 'border-neutral-200'
                          }`}
                      />
                    </div>
                    {codeError && <p className="text-[12px] text-red-500 font-bold ml-1">{codeError}</p>}
                    {codeTouched && !code && !codeError && <p className="text-[12px] text-red-500 font-bold ml-1">El código es obligatorio.</p>}
                  </div>
                  <div className="text-center">
                    <button onClick={() => { setCode(''); setCodeError(''); }} className="text-[12px] font-bold text-brand-camel hover:underline">
                      Reenviar código
                    </button>
                  </div>
                  <div className="bg-brand-beige-light border border-neutral-100 rounded-xl px-4 py-3">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase">Simulación</p>
                    <p className="text-[12px] text-neutral-500 mt-0.5">Usa el código <strong>123456</strong> para continuar.</p>
                  </div>
                  <button
                      onClick={handleStep2}
                      disabled={!step2Valid || loading}
                      className={`w-full h-12 rounded-xl font-bold text-[14px] flex items-center justify-center transition-all ${
                          step2Valid && !loading ? 'bg-brand-black text-white hover:bg-neutral-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                  >
                    {loading ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5" /> : 'Verificar código'}
                  </button>
                </div>
            )}

            {/* Paso 3 */}
            {step === 3 && (
                <div className="space-y-5">
                  {[
                    { label: 'Nueva contraseña', value: newPass, show: showNew, setShow: setShowNew, onChange: setNewPass, onBlur: () => setNewPassTouched(true), error: newPassErr },
                    { label: 'Confirmar contraseña', value: confPass, show: showConf, setShow: setShowConf, onChange: setConfPass, onBlur: () => setConfPassTouched(true), error: confPassErr },
                  ].map(({ label, value, show, setShow, onChange, onBlur, error }) => (
                      <div key={label} className="space-y-2">
                        <label className="block text-[11px] font-bold text-neutral-500 uppercase ml-1">{label}</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                          <input
                              type={show ? 'text' : 'password'}
                              placeholder="••••••••"
                              value={value}
                              onChange={e => onChange(e.target.value)}
                              onBlur={onBlur}
                              className={`w-full pl-12 pr-12 py-3 bg-white border rounded-xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors ${error ? 'border-red-500' : 'border-neutral-200'}`}
                          />
                          <button type="button" onClick={() => setShow((p: boolean) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                            {show
                                ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            }
                          </button>
                        </div>
                        {error && <p className="text-[12px] text-red-500 font-bold ml-1">{error}</p>}
                      </div>
                  ))}

                  {/* Checklist requisitos */}
                  <div className="bg-brand-beige-light border border-neutral-100 rounded-xl px-4 py-3 space-y-1.5">
                    {[
                      { label: 'Mínimo 8 caracteres',      ok: newPass.length >= 8 },
                      { label: 'Al menos una mayúscula',    ok: /[A-Z]/.test(newPass) },
                      { label: 'Al menos un número',        ok: /[0-9]/.test(newPass) },
                      { label: 'Las contraseñas coinciden', ok: confPass !== '' && confPass === newPass },
                    ].map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${r.ok ? 'bg-green-500' : 'bg-neutral-200'}`}>
                            {r.ok && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                          </div>
                          <span className={`text-[12px] font-medium ${r.ok ? 'text-green-600' : 'text-neutral-400'}`}>{r.label}</span>
                        </div>
                    ))}
                  </div>

                  <button
                      onClick={handleStep3}
                      disabled={!step3Valid || loading}
                      className={`w-full h-12 rounded-xl font-bold text-[14px] flex items-center justify-center transition-all ${
                          step3Valid && !loading ? 'bg-brand-black text-white hover:bg-neutral-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                  >
                    {loading ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5" /> : 'Cambiar contraseña'}
                  </button>
                </div>
            )}

            {/* Paso 4: Éxito */}
            {step === 4 && (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-[28px] font-display font-extrabold text-brand-black mb-2">
                    ¡Contraseña actualizada!
                  </h2>
                  <p className="text-[14px] text-neutral-400 mb-8">
                    Tu contraseña fue cambiada correctamente. Ya puedes iniciar sesión.
                  </p>
                  <button
                      onClick={() => router.push('/admin/login')}
                      className="w-full h-12 rounded-xl font-bold text-[14px] bg-brand-black text-white hover:bg-neutral-800 transition-colors"
                  >
                    Ir al inicio de sesión
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}