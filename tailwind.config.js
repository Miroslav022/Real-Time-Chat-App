/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      myBgBlue: "#171B1D",
      myBgDark: "#0A0E0F",
      myLightBlue: "#48A6C3",
      myGray: "#252B2E",
      myBlue: "#1C42B2",
      iconsGray: "#828485",
      inpurBorder: "#26292B",
      inputBg: "#202426",
      textGray: "#6C6E70",
      messageGray: "#939697",
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
};
