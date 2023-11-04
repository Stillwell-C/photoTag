/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      inset: {
        54: "13.5rem",
      },
      rotate: {
        10: "10deg",
      },
      screens: {
        "2xs": "450px",
        xs: "550px",
      },
      width: {
        "200%": "200%",
      },
      maxWidth: {
        60: "60%",
        "64p": "64px",
      },
      maxHeight: {
        "64p": "64px",
        imgPlusScreen: "calc(100vh - 225px)",
        "50%": "50vh",
      },
      keyframes: {
        "side-to-side": {
          "0%": {
            transform: "translate(-25%) scale(1)",
          },
          "5%": {
            transform: "translate(-22.5%) scale(0.95)",
          },
          "10%": {
            transform: "translate(-20%) scale(0.9)",
          },
          "15%": {
            transform: "translate(-17.5%) scale(0.85)",
          },
          "20%": {
            transform: "translate(-15%) scale(0.8)",
          },
          "25%": {
            transform: "translate(-12.5%) scale(0.75)",
          },
          "30%": {
            transform: "translate(-10%) scale(0.7)",
          },
          "35%": {
            transform: "translate(-7.5%) scale(0.65)",
          },
          "40%": {
            transform: "translate(-5%) scale(0.6)",
          },
          "45%": {
            transform: "translate(-2.5%) scale(0.55)",
          },
          "50%": {
            transform: "translate(0%) scale(0.5) scaleX(-1)",
          },
          "55%": {
            transform: "translate(2.5%) scale(0.55) scaleX(-1)",
          },
          "60%": {
            transform: "translate(5%) scale(0.6) scaleX(-1)",
          },
          "65%": {
            transform: "translate(7.5%) scale(0.65) scaleX(-1)",
          },
          "70%": {
            transform: "translate(10%) scale(0.7) scaleX(-1)",
          },
          "75%": {
            transform: "translate(12.5%) scale(0.75) scaleX(-1)",
          },
          "80%": {
            transform: "translate(15%) scale(0.8) scaleX(-1)",
          },
          "85%": {
            transform: "translate(17.5%) scale(0.85) scaleX(-1)",
          },
          "90%": {
            transform: "translate(20%) scale(0.9) scaleX(-1)",
          },
          "95%": {
            transform: "translate(22.5%) scale(0.95) scaleX(-1)",
          },
          "100%": {
            transform: "translate(25%) scale(1) scaleX(-1)",
          },
        },
      },
      animation: {
        "side-to-side": "side-to-side 3s alternate infinite",
        "spin-slow": "spin 2s linear infinite",
      },
    },
  },
  plugins: [],
};
