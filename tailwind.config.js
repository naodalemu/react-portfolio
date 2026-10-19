/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#F1EEE7', deep: '#E7E2D7' },
        ink: { DEFAULT: '#151513', soft: '#3B3934', muted: '#625E55' },
        rule: { DEFAULT: '#D5CFC2', dark: '#34322D' },
        fog: '#A8A399',
        signal: { DEFAULT: '#C23B12', bright: '#F06A3C' },
      },
      fontFamily: {
        sans: ['"Instrument Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        label: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        lede: ['clamp(1.125rem, 0.95rem + 0.6vw, 1.4rem)', { lineHeight: '1.5' }],
        heading: ['clamp(1.75rem, 1.2rem + 2.2vw, 3rem)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        title: ['clamp(2.5rem, 1.4rem + 4.8vw, 6rem)', { lineHeight: '0.96', letterSpacing: '-0.035em' }],
        display: ['clamp(3rem, 0.9rem + 8.6vw, 10.5rem)', { lineHeight: '0.9', letterSpacing: '-0.045em' }],
        numeral: ['clamp(3.5rem, 1.6rem + 7vw, 8.5rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
      },
      spacing: {
        gutter: 'clamp(1rem, 0.6rem + 2vw, 2.5rem)',
        section: 'clamp(6rem, 3rem + 9vw, 12rem)',
      },
      maxWidth: {
        page: '100rem',
        prose: '38rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      screens: {
        '3xl': '1800px',
      },
    },
  },
  plugins: [],
}
