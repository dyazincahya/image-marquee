import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        next: "src/next.tsx",
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "next/image"],
      output: {
        assetFileNames: "styles.css",
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
