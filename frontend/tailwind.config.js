export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agua-deep': '#0a5c6b',
        'agua-mid': '#0d8fa8',
        'agua-claro': '#1dd4e8',
        'agua-vivo': '#14b8d1',
        'verde-deep': '#0f6a38',
        'verde-vivo': '#1a9e52',
        'verde-claro': '#2dce7a',
        'dorado': '#f5c542',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'sans': ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}