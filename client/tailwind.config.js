export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        bangla: ['"Hind Siliguri"', "system-ui", "sans-serif"],
      },
      colors: {
        panel: "#101820",
        wire: "#f4b942",
        line: "#2563eb",
      },
    },
  },
  plugins: [],
};
