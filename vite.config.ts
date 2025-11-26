import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    host: true,
  },
});
"devDependencies": {
  "@vitejs/plugin-react-swc": "^4.2.2",
  "vite": "^5.0.10",
  "typescript": "^5.3.3",
  "tailwindcss": "^3.4.1",
  "postcss": "^8.4.35",
  "autoprefixer": "^10.4.18"
}