import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#fdb056',
        txtgray: '#cdcdcd',
        white: '#ffffff',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        gilroy: ['Gilroy', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse 1.5s ease-in-out infinite',
        'slide-down': 'slideDown 0.5s ease-out forwards',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(253, 176, 86, 0.7)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(253, 176, 86, 0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
