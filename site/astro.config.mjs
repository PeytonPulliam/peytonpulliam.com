import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.peytonpulliam.com",
  vite: {
    plugins: [tailwindcss()],
  },
});