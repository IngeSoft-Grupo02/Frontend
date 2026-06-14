export type ThemeSemantic = 'success' | 'error' | 'warning' | 'info';

export interface ThemeColors {
  primary?: string | null;
  secondary?: string | null;
  tertiary?: string | null;
}

export interface ThemeContrastTokens {
  primary: string;
  secondary: string;
  tertiary: string;
  primaryForeground: string;
  primaryMutedForeground: string;
  primaryBorder: string;
  secondaryForeground: string;
  secondaryMutedForeground: string;
  secondaryBorder: string;
  tertiaryForeground: string;
  tertiaryMutedForeground: string;
  tertiaryBorder: string;
  accentOnPrimary: string;
  accentOnSecondary: string;
  accentOnLight: string;
  successOnPrimary: string;
  successOnSecondary: string;
  errorOnPrimary: string;
  errorOnSecondary: string;
  warningOnPrimary: string;
  warningOnSecondary: string;
  infoOnPrimary: string;
  infoOnSecondary: string;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

const DEFAULT_COLORS = {
  primary: '#0F1011',
  secondary: '#475569',
  tertiary: '#D4AF37',
};

const SEMANTIC_COLORS: Record<ThemeSemantic, { dark: string; light: string }> = {
  success: { dark: '#166534', light: '#86EFAC' },
  error: { dark: '#B91C1C', light: '#FCA5A5' },
  warning: { dark: '#854D0E', light: '#FDE047' },
  info: { dark: '#1D4ED8', light: '#93C5FD' },
};

const clampChannel = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

function parseColor(color: string | null | undefined): RgbColor | null {
  if (!color) return null;
  const value = color.trim();
  const shortHex = value.match(/^#([\da-f])([\da-f])([\da-f])$/i);
  if (shortHex) {
    return {
      r: parseInt(shortHex[1] + shortHex[1], 16),
      g: parseInt(shortHex[2] + shortHex[2], 16),
      b: parseInt(shortHex[3] + shortHex[3], 16),
      a: 1,
    };
  }

  const hex = value.match(/^#([\da-f]{6})([\da-f]{2})?$/i);
  if (hex) {
    return {
      r: parseInt(hex[1].slice(0, 2), 16),
      g: parseInt(hex[1].slice(2, 4), 16),
      b: parseInt(hex[1].slice(4, 6), 16),
      a: hex[2] ? parseInt(hex[2], 16) / 255 : 1,
    };
  }

  const rgb = value.match(
    /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+)%?)?\s*\)$/i,
  );
  if (!rgb) return null;

  const rawAlpha = rgb[4] === undefined ? 1 : Number(rgb[4]);
  return {
    r: clampChannel(Number(rgb[1])),
    g: clampChannel(Number(rgb[2])),
    b: clampChannel(Number(rgb[3])),
    a: Math.max(0, Math.min(1, rawAlpha > 1 ? rawAlpha / 100 : rawAlpha)),
  };
}

function composite(color: RgbColor, base: RgbColor = { r: 255, g: 255, b: 255, a: 1 }): RgbColor {
  if (color.a >= 1) return color;
  return {
    r: clampChannel(color.r * color.a + base.r * (1 - color.a)),
    g: clampChannel(color.g * color.a + base.g * (1 - color.a)),
    b: clampChannel(color.b * color.a + base.b * (1 - color.a)),
    a: 1,
  };
}

function toHex(color: RgbColor): string {
  const channel = (value: number) => clampChannel(value).toString(16).padStart(2, '0');
  return `#${channel(color.r)}${channel(color.g)}${channel(color.b)}`.toUpperCase();
}

function normalizeColor(color: string | null | undefined, fallback: string): string {
  const parsed = parseColor(color);
  return parsed ? toHex(composite(parsed)) : fallback;
}

function relativeLuminance(color: string): number {
  const parsed = composite(parseColor(color) ?? { r: 0, g: 0, b: 0, a: 1 });
  const linear = [parsed.r, parsed.g, parsed.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function getContrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function mixColors(color: string, target: string, amount: number): string {
  const source = composite(parseColor(color) ?? { r: 0, g: 0, b: 0, a: 1 });
  const destination = composite(parseColor(target) ?? { r: 0, g: 0, b: 0, a: 1 });
  return toHex({
    r: source.r + (destination.r - source.r) * amount,
    g: source.g + (destination.g - source.g) * amount,
    b: source.b + (destination.b - source.b) * amount,
    a: 1,
  });
}

function ensureContrast(color: string, background: string, minimumRatio = 4.5): string {
  if (getContrastRatio(color, background) >= minimumRatio) return color;

  let bestColor = color;
  let bestRatio = getContrastRatio(color, background);
  for (const target of ['#000000', '#FFFFFF']) {
    for (let step = 1; step <= 20; step += 1) {
      const candidate = mixColors(color, target, step / 20);
      const ratio = getContrastRatio(candidate, background);
      if (ratio > bestRatio) {
        bestColor = candidate;
        bestRatio = ratio;
      }
      if (ratio >= minimumRatio) return candidate;
    }
  }
  return bestColor;
}

export function getReadableTextColor(backgroundColor: string): string {
  const background = normalizeColor(backgroundColor, DEFAULT_COLORS.primary);
  const dark = '#111827';
  const light = '#FFFFFF';
  return getContrastRatio(dark, background) >= getContrastRatio(light, background) ? dark : light;
}

export function getReadableMutedTextColor(backgroundColor: string): string {
  const background = normalizeColor(backgroundColor, DEFAULT_COLORS.primary);
  const foreground = getReadableTextColor(background);
  let muted = foreground;
  for (let step = 1; step <= 20; step += 1) {
    const candidate = mixColors(foreground, background, step / 20);
    if (getContrastRatio(candidate, background) < 4.5) break;
    muted = candidate;
  }
  return muted;
}

export function getAccessibleSemanticColor(backgroundColor: string, semantic: ThemeSemantic): string {
  const background = normalizeColor(backgroundColor, DEFAULT_COLORS.primary);
  const palette = SEMANTIC_COLORS[semantic];
  const best = getContrastRatio(palette.dark, background) >= getContrastRatio(palette.light, background)
    ? palette.dark
    : palette.light;
  return ensureContrast(best, background);
}

function getAccessibleAccentColor(accentColor: string, backgroundColor: string): string {
  const accent = normalizeColor(accentColor, DEFAULT_COLORS.tertiary);
  const background = normalizeColor(backgroundColor, DEFAULT_COLORS.primary);
  return ensureContrast(accent, background);
}

function getReadableBorderColor(backgroundColor: string): string {
  const background = normalizeColor(backgroundColor, DEFAULT_COLORS.primary);
  return ensureContrast(getReadableTextColor(background), background, 3);
}

export function getThemeContrastTokens(colors: ThemeColors): ThemeContrastTokens {
  const primary = normalizeColor(colors.primary, DEFAULT_COLORS.primary);
  const secondary = normalizeColor(colors.secondary, DEFAULT_COLORS.secondary);
  const tertiary = normalizeColor(colors.tertiary, DEFAULT_COLORS.tertiary);
  return {
    primary,
    secondary,
    tertiary,
    primaryForeground: getReadableTextColor(primary),
    primaryMutedForeground: getReadableMutedTextColor(primary),
    primaryBorder: getReadableBorderColor(primary),
    secondaryForeground: getReadableTextColor(secondary),
    secondaryMutedForeground: getReadableMutedTextColor(secondary),
    secondaryBorder: getReadableBorderColor(secondary),
    tertiaryForeground: getReadableTextColor(tertiary),
    tertiaryMutedForeground: getReadableMutedTextColor(tertiary),
    tertiaryBorder: getReadableBorderColor(tertiary),
    accentOnPrimary: getAccessibleAccentColor(tertiary, primary),
    accentOnSecondary: getAccessibleAccentColor(tertiary, secondary),
    accentOnLight: getAccessibleAccentColor(tertiary, '#FFFFFF'),
    successOnPrimary: getAccessibleSemanticColor(primary, 'success'),
    successOnSecondary: getAccessibleSemanticColor(secondary, 'success'),
    errorOnPrimary: getAccessibleSemanticColor(primary, 'error'),
    errorOnSecondary: getAccessibleSemanticColor(secondary, 'error'),
    warningOnPrimary: getAccessibleSemanticColor(primary, 'warning'),
    warningOnSecondary: getAccessibleSemanticColor(secondary, 'warning'),
    infoOnPrimary: getAccessibleSemanticColor(primary, 'info'),
    infoOnSecondary: getAccessibleSemanticColor(secondary, 'info'),
  };
}

export function applyThemeContrastTokens(tokens: ThemeContrastTokens, root: HTMLElement): void {
  const properties: Record<string, string> = {
    '--color-primary': tokens.primary,
    '--color-secondary': tokens.secondary,
    '--color-tertiary': tokens.tertiary,
    '--color-text-on-primary': tokens.primaryForeground,
    '--color-text-on-secondary': tokens.secondaryForeground,
    '--color-text-on-tertiary': tokens.tertiaryForeground,
    '--text-on-primary': tokens.primaryForeground,
    '--text-on-secondary': tokens.secondaryForeground,
    '--text-on-tertiary': tokens.tertiaryForeground,
    '--muted-on-primary': tokens.primaryMutedForeground,
    '--muted-on-secondary': tokens.secondaryMutedForeground,
    '--muted-on-tertiary': tokens.tertiaryMutedForeground,
    '--border-on-primary': tokens.primaryBorder,
    '--border-on-secondary': tokens.secondaryBorder,
    '--border-on-tertiary': tokens.tertiaryBorder,
    '--accent-on-primary': tokens.accentOnPrimary,
    '--accent-on-secondary': tokens.accentOnSecondary,
    '--accent-on-light': tokens.accentOnLight,
    '--color-primary-text': getAccessibleAccentColor(tokens.primary, '#FFFFFF'),
    '--color-secondary-text': getAccessibleAccentColor(tokens.secondary, '#FFFFFF'),
    '--color-tertiary-text': tokens.accentOnLight,
    '--success-on-primary': tokens.successOnPrimary,
    '--success-on-secondary': tokens.successOnSecondary,
    '--error-on-primary': tokens.errorOnPrimary,
    '--error-on-secondary': tokens.errorOnSecondary,
    '--warning-on-primary': tokens.warningOnPrimary,
    '--warning-on-secondary': tokens.warningOnSecondary,
    '--info-on-primary': tokens.infoOnPrimary,
    '--info-on-secondary': tokens.infoOnSecondary,
    '--color-camel': tokens.tertiary,
    '--color-olive': tokens.secondary,
    '--color-camel-light': `${tokens.tertiary}22`,
  };
  Object.entries(properties).forEach(([property, value]) => root.style.setProperty(property, value));
}
