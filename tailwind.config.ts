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
        brand: {
          black: '#0a0a0a',
          camel: '#B2956D',
          'camel-dark': '#9A7F5A',
          green: '#5D634B',
          'green-dark': '#4A503D',
          beige: {
            light: '#f1ede4',
            DEFAULT: '#E8E4DC',
            dark: '#D4CFC7',
          },
          bg: '#FAFAFA',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;