import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/conways-game-of-life/",
  optimizeDeps: {
    include: ["src/**/*.tsx"],
  },
});
