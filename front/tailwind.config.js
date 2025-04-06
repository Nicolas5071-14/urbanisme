export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        colors: {
            urban: {
                primary: '#1e40af',
                secondary: '#1e3a8a',
                accent: '#3b82f6',
                danger: '#dc2626',
                success: '#16a34a',
            },
        },
    },
};
export const plugins = [
    // eslint-disable-next-line no-undef
    require('@tailwindcss/forms'),
];