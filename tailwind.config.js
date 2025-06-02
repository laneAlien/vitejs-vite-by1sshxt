// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: false, // Отключаем стандартный сброс
  },
  theme: {
    extend: {
      colors: {
        tg: {
          bg: 'var(--tg-theme-bg-color)',
          text: 'var(--tg-theme-text-color)',
          hint: 'var(--tg-theme-hint-color)',
          link: 'var(--tg-theme-link-color)',
          button: 'var(--tg-theme-button-color)',
          'button-text': 'var(--tg-theme-button-text-color)',
          'secondary-bg': 'var(--tg-theme-secondary-bg-color)',
        }
      },
      borderRadius: {
        tg: 'var(--tg-border-radius)'
      },
      transitionDuration: {
        tg: 'var(--tg-transition-duration)'
      }
    }
  }
}
