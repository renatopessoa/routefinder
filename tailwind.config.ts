import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // iOS/iPadOS 18 inspired colors
                'ios-blue': '#007AFF',
                'ios-green': '#34C759',
                'ios-indigo': '#5856D6',
                'ios-orange': '#FF9500',
                'ios-pink': '#FF2D55',
                'ios-purple': '#AF52DE',
                'ios-red': '#FF3B30',
                'ios-teal': '#5AC8FA',
                'ios-yellow': '#FFCC00',
                'ios-gray': {
                    100: '#F2F2F7',
                    200: '#E5E5EA',
                    300: '#D1D1D6',
                    400: '#C7C7CC',
                    500: '#AEAEB2',
                    600: '#8E8E93',
                    700: '#636366',
                    800: '#48484A',
                    900: '#3A3A3C',
                },
                'ios-background': {
                    light: '#FFFFFF',
                    dark: '#000000',
                },
            },
            borderRadius: {
                'ios': '13px',
                'ios-lg': '20px',
                'ios-xl': '25px',
            },
            boxShadow: {
                'ios': '0 2px 10px rgba(0, 0, 0, 0.05)',
                'ios-md': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'ios-lg': '0 10px 30px rgba(0, 0, 0, 0.12)',
            },
            fontFamily: {
                'ios': ['SF Pro Text', 'SF Pro', 'system-ui', 'sans-serif'],
                'ios-display': ['SF Pro Display', 'SF Pro', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;