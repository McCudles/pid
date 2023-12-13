/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js,hbs,pug,svg}"],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%": { transform: "translateY(1rem)", opacity: "0%" },
          "100%": { transform: "translateY(0px)", opacity: "100%" },
        },
        fadein: {
          "0%": { opacity: "0%" },
          "100%": { opacity: "100%" },
        },
      },
      animation: {
        wiggle: "wiggle 0.2s ease-out",
        fadein: "fadein 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("@catppuccin/tailwindcss")({
      prefix: "ctp",
      defaultFlavour: "mocha",
    }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
};
