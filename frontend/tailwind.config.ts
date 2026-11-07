import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tinta: '#0E1013',
        grafito: {
          DEFAULT: '#181B20',
          dark: '#131518',
          light: '#242930',
        },
        papel: {
          DEFAULT: '#E8E1D0',
          dark: '#C8BEA8',
          muted: '#8F897B',
        },
        evidencia: {
          DEFAULT: '#B3262E',
          hover: '#941F26',
        },
        alerta: {
          DEFAULT: '#D9A441',
          hover: '#BA882F',
        },
      },
      fontFamily: {
        serif: ['var(--font-special-elite)', 'serif'],
        sans: ['var(--font-ibm-plex-sans)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
