/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        // foreground: "hsl(var(--foreground))",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
        fontFamily: {
          body: ["Open_Sans"],
        },
      },
    },
  },
  plugins: [],
};
