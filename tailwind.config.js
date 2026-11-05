import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
                display: ['"Space Grotesk Variable"', ...defaultTheme.fontFamily.sans],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
            },
            colors: {
                carbon: {
                    950: '#070707',
                    900: '#0E0E0E',
                    850: '#141414',
                    800: '#1F1F1F',
                    700: '#2E2E2E',
                    600: '#404040',
                },
                flame: {
                    50: '#FFF5F0',
                    100: '#FFE8DC',
                    200: '#FFCEB5',
                    300: '#FFAA82',
                    400: '#FF7D45',
                    500: '#FF4D00',
                    600: '#E04400',
                    700: '#B83800',
                    800: '#8A2A00',
                    900: '#5C1C00',
                    950: '#330F00',
                },
                'text-primary': '#FFFFFF',
                'text-secondary': '#9E9E9E',
                'text-muted': '#666666',
                // Legacy system mappings for backwards compatibility
                ink: '#070707',
                surface: '#0E0E0E',
                'surface-2': '#1F1F1F',
                text: '#FFFFFF',
                muted: '#9E9E9E',
                violet: '#FF4D00',
                amber: '#FFB84D',
                mint: '#10B981',
                coral: '#FF4D4D',
            },
            borderRadius: {
                '2xl': '16px',
            },
            backgroundImage: {
                'blueprint-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)',
            },
            backgroundSize: {
                'grid-pattern': '40px 40px',
            },
        },
    },

    plugins: [forms],
};
