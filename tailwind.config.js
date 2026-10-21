/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14201F',
        slate: { DEFAULT: '#53625F', soft: '#7A8885' },
        chalk: '#F4F7F6',
        spruce: {
          50: '#EEF5F3',
          100: '#DCEBE8',
          200: '#B9D6D1',
          500: '#1F7A72',
          600: '#165A55',
          DEFAULT: '#0F3D3A',
          800: '#0B2E2C',
          900: '#072220',
        },
        marigold: {
          100: '#FDEFCC',
          DEFAULT: '#F2A71B',
          600: '#D98F0A',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Figtree Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 18px 40px -18px rgba(15, 61, 58, 0.35)',
        card: '0 1px 2px rgba(15, 61, 58, 0.08), 0 8px 24px -12px rgba(15, 61, 58, 0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
