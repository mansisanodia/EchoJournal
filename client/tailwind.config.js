/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nature & Wellness Palette
        cream: {
          50:  '#FDFDF9',
          100: '#FAF9F4',
          200: '#F5F3EA',
          300: '#EDE9DB',
          400: '#E0D9C7',
        },
        sage: {
          50:  '#F2F5F0',
          100: '#E0EAD9',
          200: '#BDCFB6',
          300: '#94B08A',
          400: '#6B8F71',
          500: '#4E7353',
          600: '#3A5C3E',
          700: '#2C4730',
          800: '#1F3322',
          900: '#142216',
        },
        forest: {
          50:  '#EEF3EC',
          100: '#D2E1CE',
          200: '#A4C39C',
          300: '#71A067',
          400: '#4A7D41',
          500: '#2D5E25',
          600: '#1E4418',
          700: '#142F10',
          800: '#0C1F0A',
          900: '#071006',
        },
        terra: {
          50:  '#FBF3EE',
          100: '#F5DDD0',
          200: '#EBBAA0',
          300: '#D98B6A',
          400: '#C4704F',
          500: '#A8573A',
          600: '#87422B',
          700: '#63301E',
          800: '#3F1E12',
          900: '#1F0F09',
        },
        honey: {
          50:  '#FEF9EE',
          100: '#FDEFD0',
          200: '#F9D98A',
          300: '#F5C04A',
          400: '#E8A020',
          500: '#C97D0E',
          600: '#9C5E08',
          700: '#724205',
          800: '#482A03',
          900: '#241501',
        },
        stone: {
          warm: '#78716C',
          mid:  '#A8A29E',
          light:'#D6D3D1',
        }
      },
      fontFamily: {
        sans:  ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['"Lora"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'nature-gradient': 'linear-gradient(135deg, #FAF9F4 0%, #F0EDE0 40%, #E8F2E5 100%)',
        'sage-gradient':   'linear-gradient(135deg, #4E7353 0%, #6B8F71 50%, #94B08A 100%)',
        'terra-gradient':  'linear-gradient(135deg, #C4704F 0%, #D98B6A 100%)',
        'honey-gradient':  'linear-gradient(135deg, #C97D0E 0%, #E8A020 100%)',
      },
      boxShadow: {
        'nature-sm':  '0 2px 12px rgba(78,115,83,0.08)',
        'nature-md':  '0 4px 24px rgba(78,115,83,0.12)',
        'nature-lg':  '0 8px 40px rgba(78,115,83,0.16)',
        'nature-xl':  '0 16px 60px rgba(78,115,83,0.20)',
        'terra-glow': '0 8px 30px rgba(196,112,79,0.25)',
        'honey-glow': '0 8px 30px rgba(201,125,14,0.25)',
      },
      animation: {
        'float':         'float 6s ease-in-out infinite',
        'pulse-green':   'pulse-green 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'sway':          'sway 4s ease-in-out infinite',
        'fade-up':       'fade-up 0.5s ease-out forwards',
        'blob':          'blob 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        'pulse-green': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(107,143,113,0.4)' },
          '50%':     { boxShadow: '0 0 0 16px rgba(107,143,113,0)' },
        },
        sway: {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%':     { transform: 'rotate(3deg)' },
        },
        'fade-up': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        blob: {
          '0%,100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '33%':     { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '66%':     { borderRadius: '50% 30% 50% 70% / 30% 70% 50% 50%' },
        },
      },
    },
  },
  plugins: [],
}
