/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./dist/html/index.html",
    "./dist/html/customerhome.html",
    "./dist/html/vendorhome.html",
    "./dist/html/login.html",
    "./src/database.js",
    "./src/source.js",
    "./src/customer.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#",
        secondary: {
          100: "#88888e",
          200: "#e5e586",
        },
      },
      fontFamily: {
        headingside1: ["Oswald"],
        headingside2: ["Roboto Condensed"],
        headingmain2: ["Archivo Black"],
        headingmain1: ["Tilt Prism"],
      },
      keyframes: {
        bgspin: {
          "0%, 100%": {
            "background-image":
              "linear-gradient(to right, var(--tw-gradient-stops))",
          },
          "50%": {
            "background-image":
              "linear-gradient(to left, var(--tw-gradient-stops))",
          },
        },
      },
      animation: {
        bgspin: "bgspin 1s linear infinite",
      },
      screens: {
        mobile: "425px",
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
};
