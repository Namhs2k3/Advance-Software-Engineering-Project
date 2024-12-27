/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["'Josefin Sans'", "sans-serif"], 
        oswald: ["'Oswald'", "sans-serif"],
      },
    },
  },
  plugins: [
    
],
}

