export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                background: 'var(--color-background)',
                foreground: 'var(--color-foreground)',
                muted: 'var(--color-muted)',
                mutedForeground: 'var(--color-muted-foreground)',
                border: 'var(--color-border)',
                surface: 'var(--color-surface)',
                surfaceElevated: 'var(--color-surface-elevated)',
                surfaceStrong: 'var(--color-surface-strong)',
                forest: {
                    50: 'var(--color-forest-50)',
                    100: 'var(--color-forest-100)',
                    200: 'var(--color-forest-200)',
                    300: 'var(--color-forest-300)',
                    400: 'var(--color-forest-400)',
                    500: 'var(--color-forest-500)',
                    600: 'var(--color-forest-600)',
                    700: 'var(--color-forest-700)',
                    800: 'var(--color-forest-800)',
                    900: 'var(--color-forest-900)',
                },
                berry: {
                    50: 'var(--color-berry-50)',
                    100: 'var(--color-berry-100)',
                    200: 'var(--color-berry-200)',
                    300: 'var(--color-berry-300)',
                    400: 'var(--color-berry-400)',
                    500: 'var(--color-berry-500)',
                    600: 'var(--color-berry-600)',
                    700: 'var(--color-berry-700)',
                    800: 'var(--color-berry-800)',
                    900: 'var(--color-berry-900)',
                },
                gold: {
                    100: 'var(--color-gold-100)',
                    300: 'var(--color-gold-300)',
                    500: 'var(--color-gold-500)',
                },
                success: 'var(--color-success)',
                danger: 'var(--color-danger)',
                info: 'var(--color-info)',
            },
            boxShadow: {
                soft: '0 18px 40px -28px rgba(15, 23, 42, 0.45)',
                glow: '0 0 0 1px rgba(255, 255, 255, 0.05), 0 26px 60px -34px rgba(18, 58, 44, 0.5)',
                berry: '0 22px 48px -30px rgba(126, 28, 62, 0.55)',
            },
            fontFamily: {
                sans: ['Inter', 'Avenir Next', 'Segoe UI', 'system-ui', 'sans-serif'],
                display: ['Fraunces', 'Iowan Old Style', 'Georgia', 'serif'],
            },
            backgroundImage: {
                'forest-glow': 'radial-gradient(circle at top left, rgba(77, 124, 15, 0.16), transparent 42%), radial-gradient(circle at top right, rgba(126, 28, 62, 0.12), transparent 40%), linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 56%)',
            },
            maxWidth: {
                '8xl': '90rem',
            },
            transitionTimingFunction: {
                expressive: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            },
        },
    },
    plugins: [],
};
