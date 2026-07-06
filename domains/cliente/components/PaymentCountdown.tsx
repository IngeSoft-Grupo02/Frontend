'use client';

import React from 'react';
import { Clock } from 'lucide-react';

const PAYMENT_WINDOW_MS = 5 * 60 * 1000;

const parseBackendTimestamp = (value: string) => {
  const trimmed = value.trim();
  const normalizedPrecision = trimmed.replace(/\.(\d{3})\d+/, '.$1');
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalizedPrecision);
  const looksLikeDateTime = /^\d{4}-\d{2}-\d{2}T/.test(normalizedPrecision);
  return Date.parse(looksLikeDateTime && !hasTimezone ? `${normalizedPrecision}Z` : normalizedPrecision);
};

const paymentDeadline = (createdAt?: string) => {
  if (!createdAt) return null;
  const timestamp = parseBackendTimestamp(createdAt);
  return Number.isNaN(timestamp) ? null : timestamp + PAYMENT_WINDOW_MS;
};

export const isPaymentWindowExpired = (createdAt?: string) => {
  const deadline = paymentDeadline(createdAt);
  return deadline != null && deadline <= Date.now();
};

const formatTimeLeft = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

interface PaymentCountdownProps {
  createdAt?: string;
  compact?: boolean;
  className?: string;
  onExpired?: () => void;
}

export const PaymentCountdown: React.FC<PaymentCountdownProps> = ({
  createdAt,
  compact = false,
  className = '',
  onExpired,
}) => {
  const deadline = paymentDeadline(createdAt);
  const [now, setNow] = React.useState(() => Date.now());
  const expiredNotifiedRef = React.useRef(false);

  React.useEffect(() => {
    if (!deadline) return undefined;
    expiredNotifiedRef.current = false;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  React.useEffect(() => {
    if (!deadline) return;
    if (deadline - now <= 0 && !expiredNotifiedRef.current) {
      expiredNotifiedRef.current = true;
      onExpired?.();
    }
  }, [deadline, now, onExpired]);

  if (!deadline) return null;

  const timeLeft = Math.max(0, deadline - now);
  const expired = timeLeft <= 0;
  const urgent = timeLeft <= 60 * 1000;
  const progress = Math.max(0, Math.min(100, (timeLeft / PAYMENT_WINDOW_MS) * 100));

  return (
    <div
      className={`rounded-2xl border ${compact ? 'px-3 py-2' : 'p-4'} ${className}`}
      style={{
        backgroundColor: expired ? '#FEF2F2' : urgent ? '#FFFBEB' : 'var(--color-primary)',
        color: expired ? '#991B1B' : urgent ? '#92400E' : 'var(--text-on-primary)',
        borderColor: expired ? '#FECACA' : urgent ? '#FDE68A' : 'rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Clock size={compact ? 16 : 18} className="shrink-0" />
          <span className={`${compact ? 'text-[10px]' : 'text-[12px]'} font-black uppercase tracking-wider`}>
            {expired ? 'Tiempo agotado' : 'Tiempo para pagar'}
          </span>
        </div>
        <span className={`${compact ? 'text-[16px]' : 'text-[24px]'} whitespace-nowrap font-black tabular-nums leading-none`}>
          {formatTimeLeft(timeLeft)}
        </span>
      </div>
      {!compact && (
        <p className="mt-2 text-[11px] font-bold opacity-75">
          {expired
            ? 'El plazo venció. El pedido será cancelado si aún no se actualizó.'
            : 'Completa el pago antes de que el pedido expire.'}
        </p>
      )}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: expired ? '#DC2626' : urgent ? '#D97706' : 'var(--color-tertiary)' }}
        />
      </div>
    </div>
  );
};
