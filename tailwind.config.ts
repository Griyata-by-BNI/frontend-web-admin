/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "primary-black": "#25253F",

        "light-tosca": "#EAF6F6",
        "primary-tosca": "#30A5A2",
        "dark-tosca": "#247C7A",

        "light-purple": "#F5F2FB",
        "primary-purple": "#9B7EDA",
        "dark-purple": "#745FA4",
      },
    },
  },
  plugins: [],
};
