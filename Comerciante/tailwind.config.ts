import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000',
        'brand-olive': '#5D634B',
        'brand-camel': '#B2956D',
        'brand-neutral-light': '#F7F7F5',
        'brand-neutral-mid': '#EDEDE9',
        'brand-neutral-border': '#E5E5E0',
        'brand-text-muted': '#717171',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;