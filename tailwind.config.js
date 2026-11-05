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
                sans: ['"Plus Jakarta Sans"', '"Inter Variable"', ...defaultTheme.fontFamily.sans],
                display: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
                serif: ['"Instrument Serif"', 'Georgia', 'serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            colors: {
                // Editorial & Human Warm Palette
                canvas: {
                    DEFAULT: '#FAF9F5',
                    pure: '#FFFFFF',
                    subtle: '#F3F4F6',
                    warm: '#F7F5F0',
                },
                ink: {
                    DEFAULT: '#0F172A',
                    950: '#020617',
                    900: '#0F172A',
                    800: '#1E293B',
                    700: '#334155',
                    600: '#475569',
                    500: '#64748B',
                    400: '#94A3B8',
                    300: '#CBD5E1',
                    200: '#E2E8F0',
                    100: '#F1F5F9',
                    50: '#F8FAFC',
                },
                brand: {
                    blue: '#2563EB',
                    'blue-hover': '#1D4ED8',
                    'blue-light': '#EFF6FF',
                    terracotta: '#D95338',
                    'terracotta-light': '#FDF2F0',
                    forest: '#0D3B2E',
                    'forest-light': '#F0FDF4',
                    sand: '#F6EFE9',
                    sun: '#FDE047',
                    'sun-light': '#FEF9C3',
                },
                // Aliases for seamless component backward-compatibility with light theme
                carbon: {
                    950: '#FAF9F5', // Canvas base
                    900: '#FFFFFF', // Card surface
                    850: '#F8FAFC', // Slightly elevated/input surface
                    800: '#E2E8F0', // Dividers & borders
                    700: '#CBD5E1', // Focused borders
                    600: '#94A3B8',
                },
                flame: {
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#2563EB', // Primary interactive accent (vibrant Royal Blue)
                    600: '#1D4ED8',
                    700: '#1E40AF',
                    800: '#1E3A8A',
                    900: '#172554',
                    950: '#0F172A',
                },
                'text-primary': '#0F172A',
                'text-secondary': '#475569',
                'text-muted': '#64748B',
                surface: '#FFFFFF',
                'surface-2': '#F8FAFC',
                text: '#0F172A',
                muted: '#64748B',
            },
            borderRadius: {
                '2xl': '18px',
                '3xl': '24px',
                '4xl': '32px',
            },
            boxShadow: {
                subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
                card: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
                float: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.04)',
            },
        },
    },

    plugins: [forms],
};
