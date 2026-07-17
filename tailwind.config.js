/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        agro: {
          bg: '#0a1410',
          panel: '#0f1f1a',
          panel2: '#132821',
          border: '#1c3a30',
          edge: '#244a3d',
          primary: '#3ddc97',
          primary2: '#2bb37a',
          accent: '#5fd9ff',
          accent2: '#3aa9c9',
          warn: '#ffb547',
          danger: '#ff5d6c',
          ok: '#3ddc97',
          text: '#e6f4ee',
          muted: '#7fa89a',
          dim: '#4d7466',
        },
        soil: {
          50: '#f6f7f2',
          100: '#e8ebe0',
          400: '#9ca88a',
          700: '#4a5236',
          900: '#1a1f12',
        },
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(61,220,151,0.35)',
        glowAccent: '0 0 24px -4px rgba(95,217,255,0.35)',
        panel: '0 8px 32px -12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        drift: {
          '0%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(8px,-10px)' },
          '100%': { transform: 'translate(0,0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2s ease-out infinite',
        floaty: 'floaty 5s ease-in-out infinite',
        sweep: 'sweep 3s linear infinite',
        spinSlow: 'spinSlow 8s linear infinite',
        drift: 'drift 6s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
