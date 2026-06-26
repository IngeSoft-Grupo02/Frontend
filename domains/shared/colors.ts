import type { CSSProperties } from 'react';

export interface ColorDisplay {
  label: string;
  swatch: string;
  border: string;
  mapped: boolean;
}

const COLOR_MAP: Record<string, Omit<ColorDisplay, 'mapped'>> = {
  BLACK: { label: 'Negro', swatch: '#000000', border: 'rgba(0,0,0,0.22)' },
  NEGRO: { label: 'Negro', swatch: '#000000', border: 'rgba(0,0,0,0.22)' },
  WHITE: { label: 'Blanco', swatch: '#FFFFFF', border: '#94A3B8' },
  BLANCO: { label: 'Blanco', swatch: '#FFFFFF', border: '#94A3B8' },
  RED: { label: 'Rojo', swatch: '#DC2626', border: 'rgba(0,0,0,0.14)' },
  ROJO: { label: 'Rojo', swatch: '#DC2626', border: 'rgba(0,0,0,0.14)' },
  BLUE: { label: 'Azul', swatch: '#2563EB', border: 'rgba(0,0,0,0.14)' },
  AZUL: { label: 'Azul', swatch: '#2563EB', border: 'rgba(0,0,0,0.14)' },
  GREEN: { label: 'Verde', swatch: '#16A34A', border: 'rgba(0,0,0,0.14)' },
  VERDE: { label: 'Verde', swatch: '#16A34A', border: 'rgba(0,0,0,0.14)' },
  YELLOW: { label: 'Amarillo', swatch: '#FACC15', border: '#A16207' },
  AMARILLO: { label: 'Amarillo', swatch: '#FACC15', border: '#A16207' },
  ORANGE: { label: 'Naranja', swatch: '#F97316', border: 'rgba(0,0,0,0.14)' },
  NARANJA: { label: 'Naranja', swatch: '#F97316', border: 'rgba(0,0,0,0.14)' },
  PURPLE: { label: 'Morado', swatch: '#7C3AED', border: 'rgba(0,0,0,0.14)' },
  MORADO: { label: 'Morado', swatch: '#7C3AED', border: 'rgba(0,0,0,0.14)' },
  PINK: { label: 'Rosado', swatch: '#EC4899', border: 'rgba(0,0,0,0.14)' },
  ROSADO: { label: 'Rosado', swatch: '#EC4899', border: 'rgba(0,0,0,0.14)' },
  GRAY: { label: 'Gris', swatch: '#6B7280', border: 'rgba(0,0,0,0.14)' },
  GREY: { label: 'Gris', swatch: '#6B7280', border: 'rgba(0,0,0,0.14)' },
  GRIS: { label: 'Gris', swatch: '#6B7280', border: 'rgba(0,0,0,0.14)' },
  BROWN: { label: 'Marrón', swatch: '#92400E', border: 'rgba(0,0,0,0.14)' },
  MARRON: { label: 'Marrón', swatch: '#92400E', border: 'rgba(0,0,0,0.14)' },
  BEIGE: { label: 'Beige', swatch: '#D6C7A1', border: '#A58B5F' },
  NAVY: { label: 'Azul marino', swatch: '#1E3A8A', border: 'rgba(0,0,0,0.14)' },
  GOLD: { label: 'Dorado', swatch: '#D4AF37', border: '#9A6B00' },
  DORADO: { label: 'Dorado', swatch: '#D4AF37', border: '#9A6B00' },
  SILVER: { label: 'Plateado', swatch: '#C0C0C0', border: '#8A8A8A' },
  PLATEADO: { label: 'Plateado', swatch: '#C0C0C0', border: '#8A8A8A' },
  ONYX_BLACK: { label: 'Negro ónix', swatch: '#0F1011', border: 'rgba(0,0,0,0.22)' },
  DEEP_ZINC: { label: 'Zinc profundo', swatch: '#3F3F46', border: 'rgba(0,0,0,0.14)' },
  MIDNIGHT: { label: 'Azul medianoche', swatch: '#1A2332', border: 'rgba(0,0,0,0.14)' },
  CHARCOAL: { label: 'Carbón', swatch: '#36454F', border: 'rgba(0,0,0,0.14)' },
  ESPRESSO: { label: 'Espresso', swatch: '#4B3621', border: 'rgba(0,0,0,0.14)' },
  ALABASTER: { label: 'Alabastro', swatch: '#F9FAFB', border: '#CBD5E1' },
  WARM_CREAM: { label: 'Crema cálida', swatch: '#FDFBF7', border: '#D6C7A1' },
  OLIVE_DRAB: { label: 'Verde oliva', swatch: '#6B705C', border: 'rgba(0,0,0,0.14)' },
  SLATE: { label: 'Pizarra', swatch: '#475569', border: 'rgba(0,0,0,0.14)' },
  SAGE: { label: 'Verde salvia', swatch: '#8A9A86', border: 'rgba(0,0,0,0.14)' },
  TERRA: { label: 'Terracota', swatch: '#E2725B', border: 'rgba(0,0,0,0.14)' },
  DUSTY_RED: { label: 'Rojo polvoriento', swatch: '#B25C5C', border: 'rgba(0,0,0,0.14)' },
  GHOST_WHITE: { label: 'Blanco fantasma', swatch: '#FFFFFF', border: '#94A3B8' },
  SOFT_TAUPE: { label: 'Topo suave', swatch: '#D5CEC4', border: '#A8A29E' },
  BLUSH_PINK: { label: 'Rosa rubor', swatch: '#F4C2C2', border: '#D38E8E' },
  FROSTED_BLUE: { label: 'Azul escarchado', swatch: '#B0E0E6', border: '#6BAAB5' },
  RICH_CAMEL: { label: 'Camello', swatch: '#B2956D', border: '#8A6D45' },
  RAW_GOLD: { label: 'Dorado bruto', swatch: '#D4AF37', border: '#9A6B00' },
  SILVER_MIST: { label: 'Plata neblina', swatch: '#C9CFD4', border: '#9AA3AD' },
  STONE: { label: 'Piedra', swatch: '#A8A29E', border: '#78716C' },
  COPPER: { label: 'Cobre', swatch: '#B87333', border: 'rgba(0,0,0,0.14)' },
  COBALT_BLUE: { label: 'Azul cobalto', swatch: '#2563EB', border: 'rgba(0,0,0,0.14)' },
  CORAL_PUNCH: { label: 'Coral', swatch: '#FF5A5F', border: 'rgba(0,0,0,0.14)' },
  EMERALD: { label: 'Esmeralda', swatch: '#10B981', border: 'rgba(0,0,0,0.14)' },
  SUNFLOWER: { label: 'Girasol', swatch: '#FFC107', border: '#A16207' },
  HOT_MAGENTA: { label: 'Magenta', swatch: '#FF00FF', border: 'rgba(0,0,0,0.14)' },
  VIOLET_POP: { label: 'Violeta', swatch: '#8B5CF6', border: 'rgba(0,0,0,0.14)' },
};

function normalizeColorKey(color: string): string {
  return color
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
}

function fallbackLabel(color: string): string {
  const readable = color
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  return readable ? readable.charAt(0).toUpperCase() + readable.slice(1) : 'Color';
}

export function getColorDisplay(color: string | null | undefined): ColorDisplay {
  const raw = String(color || '').trim();
  const key = normalizeColorKey(raw);
  const mapped = COLOR_MAP[key];
  if (mapped) return { ...mapped, mapped: true };

  return {
    label: fallbackLabel(raw),
    swatch: '#CBD5E1',
    border: '#94A3B8',
    mapped: false,
  };
}

export function getColorLabel(color: string | null | undefined): string {
  return getColorDisplay(color).label;
}

export function getColorSwatchStyle(color: string | null | undefined): CSSProperties {
  const display = getColorDisplay(color);
  return {
    backgroundColor: display.swatch,
    borderColor: display.border,
  };
}
