import { AuditLogResponse } from './api';

function isLoginEvent(log: AuditLogResponse): boolean {
  return log.endpoint?.toLowerCase().includes('/auth/login') ?? false;
}

export function auditUserLabel(log: AuditLogResponse): string {
  const userEmail = log.userEmail?.trim();
  if (userEmail && userEmail !== 'no-autenticado') return userEmail;
  if (isLoginEvent(log)) return 'No autenticado';
  return 'Sistema';
}

export function auditRoleLabel(log: AuditLogResponse): string {
  const role = log.role?.trim();
  if (role === 'SYSTEM_ADMIN') return 'Super admin';
  if (role === 'MERCHANT') return 'Comerciante';
  if (role === 'CUSTOMER') return 'Cliente';
  if (role === 'NO_REGISTRADO') return 'No registrado';
  if (role === 'PUBLICO') return 'Público';
  if (role) return role;
  if (isLoginEvent(log)) return 'No registrado';
  return 'Público';
}
