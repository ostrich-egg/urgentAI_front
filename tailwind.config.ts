import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#EDE8F5",
        foreground: "#3D52A0",
        secondary: "#7091E6",
        grey: "#8697c4"
      },
    },
  },
  plugins: [],
};
export default config;
