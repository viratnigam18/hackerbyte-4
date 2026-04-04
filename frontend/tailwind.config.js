/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fintech: { dark: '#0B0D17', mint: '#D1F2EB', navy: '#1A237E', accent1: '#4facfe', accent2: '#00f2fe' },
        ll: {
          bg: '#071a10',
          'bg-light': '#0c2a1a',
          surface: 'rgba(255,255,255,0.04)',
          cyan: '#4ade80',          // ← NOW GREEN (was cyan)
          'cyan-dim': 'rgba(74,222,128,0.15)',
          red: '#ff4d4d',
          'red-dim': 'rgba(255,77,77,0.15)',
          yellow: '#facc15',
          'yellow-dim': 'rgba(250,204,21,0.15)',
          purple: '#a78bfa',
          'purple-dim': 'rgba(167,139,250,0.15)',
          emerald: '#34d399',
          teal: '#2f855a',
          amber: '#FBBF24',
          text: '#f1f5f9',
          'text-muted': '#64748b',
          'text-dim': '#334155',
          border: 'rgba(255,255,255,0.08)',
          'border-hover': 'rgba(255,255,255,0.14)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: { 'xl': '16px', '2xl': '20px', '3xl': '24px' },
      boxShadow: {
        'glow-cyan': '0 0 30px rgba(74,222,128,0.15)',
        'glow-red': '0 0 30px rgba(255,77,77,0.2)',
        'glow-purple': '0 0 30px rgba(167,139,250,0.15)',
        'glow-yellow': '0 0 30px rgba(250,204,21,0.15)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
        'glass-lg': '0 16px 48px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
