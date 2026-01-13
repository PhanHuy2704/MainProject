/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3AA1A0",
        verdigris: {
          50: "#eefafa",
          100: "#d5f2f2",
          200: "#b0e6e6",
          300: "#7dd4d3",
          400: "#4ebebe",
          500: "#3AA1A0",
          600: "#2a8281",
          700: "#25696a",
          800: "#235556",
          900: "#204849",
          950: "#0d2a2b"
        }
      }
    }
  },
  plugins: []
};
