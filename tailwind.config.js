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
            },
            colors: {
                ink: '#0E1030',
                surface: '#171A45',
                'surface-2': '#20246B',
                text: '#EDEFFF',
                muted: '#A9AEDD',
                violet: '#7C5CFF',
                amber: '#FFB84D',
                mint: '#3DDBA4',
                coral: '#FF6B8A',
            },
            borderRadius: {
                '2xl': '16px',
            },
        },
    },

    plugins: [forms],
};