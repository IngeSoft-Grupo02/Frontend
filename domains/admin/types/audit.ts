export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    role: string;
    tenant: string;
    action: string;
    level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  }