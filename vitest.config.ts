import { resolve } from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // other test options...
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
