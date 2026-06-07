import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        'text-on-primary': 'var(--text-on-primary)',
        'text-on-secondary': 'var(--text-on-secondary)',
        'text-on-tertiary': 'var(--text-on-tertiary)',
      },
    },
  },
  plugins: [],
};

export default config;
