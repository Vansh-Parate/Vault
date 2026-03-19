/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#4F7F73',
          hover: '#3D6860',
          light: '#EAF0EE',
        },
        beige: '#C9C6B1',
        cream: {
          DEFAULT: '#E7E2D3',
          card: '#F2EFE6',
          input: '#EDE9DF',
        },
        dark: {
          DEFAULT: '#2E4A44',
          mid: '#3D5C55',
          muted: '#7A938E',
        },
        white: '#FDFCF9',
        danger: {
          DEFAULT: '#8B3A2F',
          light: '#F5EAE8',
        },
        warning: {
          DEFAULT: '#7A6020',
          light: '#F5F0E0',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Instrument Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
