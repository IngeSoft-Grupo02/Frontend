const AUDIT_TIME_ZONE = 'America/Lima';
const TIME_ZONE_SUFFIX = /(?:Z|[+-]\d{2}:?\d{2})$/i;

export function parseAuditTimestamp(value?: string | null): Date | null {
  if (!value) return null;

  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const isoValue = TIME_ZONE_SUFFIX.test(normalized) ? normalized : `${normalized}Z`;
  const date = new Date(isoValue);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function auditTimestampMs(value?: string | null): number {
  return parseAuditTimestamp(value)?.getTime() ?? 0;
}

export function formatAuditTimestamp(value?: string | null): string {
  const date = parseAuditTimestamp(value);
  if (!date) return value || '—';

  return date.toLocaleString('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: AUDIT_TIME_ZONE,
  });
}
