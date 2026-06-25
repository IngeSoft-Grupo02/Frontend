'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@/domains/admin/components/UI';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import {
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
  requestPasswordReset,
  resetPassword,
  validatePasswordResetToken,
} from '@/domains/auth/passwordRecovery';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';
import { messageFromError } from '@/domains/shared/errors';

function RecuperarContrasenaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [step, setStep] = useState(token ? 0 : 1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    validatePasswordResetToken(token)
      .then(valid => {
        if (valid) setStep(3);
        else {
          setError('El enlace es inválido, expiró o ya fue utilizado.');
          setStep(1);
        }
      })
      .catch(() => {
        setError('No se pudo validar el enlace. Solicita uno nuevo.');
        setStep(1);
      });
  }, [token]);

  const handleSendLink = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo válido');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await requestPasswordReset(email);
      setStep(2);
    } catch (requestError) {
      setError(messageFromError(requestError, 'No se pudo enviar el correo.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token) {
      setError('Solicita un nuevo enlace de recuperación.');
      setStep(1);
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setError(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(token, newPassword);
      setStep(4);
    } catch (resetError) {
      setError(messageFromError(resetError, 'No se pudo cambiar la contraseña.'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push(ADMIN_ROUTES.login);
  };

  const newPasswordHasMinLength = newPassword.length >= 8;
  const newPasswordHasRequiredCharacters =
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /\d/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 lg:p-10 overflow-hidden">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-0 md:gap-12 bg-white rounded-[40px] shadow-2xl overflow-hidden h-auto md:h-[750px]">
        
        {/* Left Section - Steps */}
        <div className="w-full md:w-[450px] bg-brand-black p-12 lg:p-16 flex flex-col text-white relative">
          <div className="z-10">
            <h1 className="text-[48px] font-display font-extrabold leading-tight mb-8">
              Administrador
            </h1>
            <p className="text-[16px] text-neutral-400 font-medium mb-12">
              Solicitud, verificación y restablecimiento guiado.
            </p>

            <div className="space-y-12">
              {[
                { step: '1', label: 'Solicitar enlace', active: step >= 1 },
                { step: '2', label: 'Revisar correo', active: step >= 2 },
                { step: '3', label: 'Definir nueva contraseña', active: step >= 3 },
                { step: '4', label: 'Volver a iniciar sesión', active: step >= 4 },
              ].map((s, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[14px] transition-colors ${
                    s.active ? 'bg-brand-green text-white' : 'bg-neutral-800 text-neutral-600'
                  }`}>
                    {s.active ? <CheckCircle2 size={16} /> : s.step}
                  </div>
                  <span className={`text-[16px] font-extrabold transition-colors ${
                    s.active ? 'text-white' : 'text-neutral-600 font-medium'
                  }`}>
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mt-auto bg-neutral-900/50 p-8 rounded-3xl z-10">
            <p className="text-[12px] text-neutral-400 mb-2">
              Flujo disponible también desde
            </p>
            <p className="text-[14px] text-white font-bold italic">
              "¿Olvidaste tu contraseña?" en el inicio de sesión.
            </p>
          </div>

          <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-black via-brand-black to-brand-green/20" />
        </div>

        {/* Right Section - Form */}
        <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center relative bg-white">
          <div className="max-w-md w-full mx-auto">
            
            {/* Step 1: Request Link */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <button 
                  onClick={handleBackToLogin}
                  className="flex items-center gap-2 text-brand-camel font-bold text-[14px] mb-6 hover:underline"
                >
                  <ArrowLeft size={16} /> Volver al inicio de sesión
                </button>

                <h2 className="text-[42px] font-display font-extrabold leading-tight mb-2 tracking-tight">
                  Recuperar contraseña
                </h2>
                <p className="text-[16px] text-neutral-400 font-medium mb-12">
                  Ingresa tu correo administrativo para enviarte un enlace seguro.
                </p>
              
                <div className="space-y-8">
                  <Input 
                    label="Correo electrónico" 
                    placeholder="admin@plataforma.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    error={error}
                  />
                 
                  <div className="bg-[#f1ede4] p-8 rounded-[32px] border border-neutral-100">
                    <h4 className="text-[20px] font-display font-extrabold mb-4">
                      Validaciones
                    </h4>
                    <ul className="space-y-2 text-[15px] font-medium text-neutral-700">
                      <li>• El enlace expira en 30 minutos.</li>
                      <li>• Solo puede utilizarse una vez.</li>
                      <li>• La respuesta no revela si el correo existe.</li>
                    </ul>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="secondary" 
                      className="flex-1 rounded-2xl h-14" 
                      onClick={handleBackToLogin}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="flex-1 rounded-2xl h-14" 
                      onClick={handleSendLink}
                      disabled={loading}
                    >
                      {loading ? 'Enviando...' : 'Enviar enlace'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Check Email */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-brand-green" />
                </div>

                <h2 className="text-[32px] font-display font-extrabold mb-4">
                  ¡Correo enviado!
                </h2>
                <p className="text-[16px] text-neutral-400 font-medium mb-8">
                  Hemos enviado un enlace de recuperación a:
                </p>
                <p className="text-[18px] font-bold text-brand-black mb-12">
                  {email}
                </p>

                <div className="bg-brand-beige-light p-6 rounded-2xl mb-8">
                  <p className="text-[14px] font-medium text-neutral-700">
                    ¿No recibiste el correo?
                  </p>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-brand-camel font-bold text-[14px] mt-2 hover:underline"
                  >
                    Reenviar enlace
                  </button>
                </div>

                <Button 
                  className="w-full rounded-2xl h-14" 
                  onClick={handleBackToLogin}
                >
                  Volver al inicio de sesión
                </Button>
              </motion.div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-[32px] font-display font-extrabold mb-2">
                  Nueva contraseña
                </h2>
                <p className="text-[16px] text-neutral-400 font-medium mb-12">
                  Define una contraseña segura para tu cuenta
                </p>

                <div className="space-y-6">
                  <div className="relative">
                    <Input 
                      label="Nueva contraseña" 
                      type={showNewPassword && newPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                      }}
                      className="pr-12"
                      error={error && newPassword.length > 0 && newPassword.length < 8 ? 'Mínimo 8 caracteres' : ''}
                    />
                    {newPassword && (
                      <button
                        type="button"
                        aria-label={showNewPassword ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
                        onClick={() => setShowNewPassword(value => !value)}
                        className="absolute right-4 top-10 text-neutral-400 transition-colors hover:text-brand-black"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Input 
                      label="Confirmar contraseña" 
                      type={showConfirmPassword && confirmPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      className="pr-12"
                      error={error && confirmPassword.length > 0 && newPassword !== confirmPassword ? 'Las contraseñas no coinciden' : ''}
                    />
                    {confirmPassword && (
                      <button
                        type="button"
                        aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
                        onClick={() => setShowConfirmPassword(value => !value)}
                        className="absolute right-4 top-10 text-neutral-400 transition-colors hover:text-brand-black"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-[14px] font-bold">
                      {error}
                    </div>
                  )}

                  <div className="bg-brand-beige-light p-6 rounded-2xl">
                    <h4 className="text-[14px] font-bold text-neutral-800 mb-3 uppercase">
                      Requisitos de contraseña
                    </h4>
                    <ul className="space-y-2 text-[13px] text-neutral-600">
                      <li className={newPasswordHasMinLength ? 'text-brand-green font-bold' : ''}>
                        {newPasswordHasMinLength ? '✓' : '○'} Mínimo 8 caracteres
                      </li>
                      <li className={passwordsMatch ? 'text-brand-green font-bold' : 'text-neutral-600'}>
                        {passwordsMatch ? '✓' : '○'} Las contraseñas deben coincidir
                      </li>
                      <li className={newPasswordHasRequiredCharacters ? 'text-brand-green font-bold' : 'text-neutral-600'}>
                        {newPasswordHasRequiredCharacters ? '✓' : '○'} Debe incluir mayúscula, minúscula, número y símbolo
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="secondary" 
                      className="flex-1 rounded-2xl h-14" 
                      onClick={() => setStep(2)}
                    >
                      Atrás
                    </Button>
                    <Button 
                      className="flex-1 rounded-2xl h-14" 
                      onClick={handleResetPassword}
                      disabled={loading}
                    >
                      {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} className="text-brand-green" />
                </div>

                <h2 className="text-[36px] font-display font-extrabold mb-4">
                  ¡Contraseña actualizada!
                </h2>
                <p className="text-[16px] text-neutral-400 font-medium mb-12">
                  Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tus nuevas credenciales.
                </p>

                <Button 
                  className="w-full rounded-2xl h-14" 
                  onClick={handleBackToLogin}
                >
                  Volver a iniciar sesión
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecuperarContrasenaPage() {
  return (
    <Suspense fallback={null}>
      <RecuperarContrasenaContent />
    </Suspense>
  );
}
