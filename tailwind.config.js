/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        // ERD-specific tokens
        'erd-canvas': 'hsl(var(--erd-canvas))',
        'erd-table': 'hsl(var(--erd-table))',
        'erd-table-border': 'hsl(var(--erd-table-border))',
        'erd-table-header': 'hsl(var(--erd-table-header))',
        'erd-table-header-foreground': 'hsl(var(--erd-table-header-foreground))',
        'connection-line': 'hsl(var(--connection-line))',
        'connection-hover': 'hsl(var(--connection-hover))',
        // Sidebar
        'sidebar-bg': 'hsl(var(--sidebar-bg))',
        'sidebar-text': 'hsl(var(--sidebar-text))',
        'sidebar-item': 'hsl(var(--sidebar-item))',
        'sidebar-item-hover': 'hsl(var(--sidebar-item-hover))',
        // Field type colors
        'field-text': 'hsl(var(--field-text))',
        'field-email': 'hsl(var(--field-email))',
        'field-number': 'hsl(var(--field-number))',
        'field-date': 'hsl(var(--field-date))',
        'field-boolean': 'hsl(var(--field-boolean))',
        'field-relation': 'hsl(var(--field-relation))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
