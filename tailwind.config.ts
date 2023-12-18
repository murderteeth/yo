import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      animation: {
        'flicker': 'pulse 250ms cubic-bezier(1, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar')
  ]
}

export default config
