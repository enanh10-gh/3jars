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
        'jar-spend': '#3B82F6', // Blue
        'jar-save': '#10B981',  // Green
        'jar-give': '#EF4444',   // Heart Red
      },
      animation: {
        'fill-up': 'fillUp 1s ease-out forwards',
      },
      keyframes: {
        fillUp: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        }
      }
    },
  },
  plugins: [],
}
export default config