/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Configurar fonte sans como padrão
        sans: ['System', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
          // Cores principais
          background: '#131517',
          text: '#F3F5F7',
          primary: '#4A90E2',
          
          // Variantes do background
          'bg-light': '#1E2124',
          'bg-lighter': '#2A2D30',
          'bg-dark': '#0F1113',
          
          // Variantes do texto
          'text-primary': '#F3F5F7',
          'text-secondary': '#D1D5DB',
          'text-tertiary': '#9CA3AF',
          'text-muted': '#6B7280',
          
          // Variantes do primary
          'primary-light': '#6BAED6',
          'primary-lighter': '#8BC4E8',
          'primary-dark': '#3B7BC8',
          'primary-darker': '#2E5AA8',
          
          // Cores de estado
          success: '#00B894',
          'success-light': '#00CEC9',
          'success-dark': '#00A085',
          
          warning: '#F39C12',
          'warning-light': '#F7DC6F',
          'warning-dark': '#E67E22',
          
          error: '#E74C3C',
          'error-light': '#FF6B6B',
          'error-dark': '#C0392B',
          
          info: '#3498DB',
          'info-light': '#5DADE2',
          'info-dark': '#2980B9',
        },
      },
  },
  plugins: [],
};

