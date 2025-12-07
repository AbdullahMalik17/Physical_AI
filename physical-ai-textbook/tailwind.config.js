/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Custom components
    './docs/**/*.{md,mdx}',        // MDX content files
  ],
  theme: {
    extend: {
      colors: {
        'cyber-cyan': '#00d9ff',
        'cyber-purple': '#bd00ff',
        'deep-space': '#0f0f23',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
  // Prefix to avoid conflicts with Docusaurus styles
  prefix: 'tw-',
  important: false,
};
