import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const pkg = JSON.parse(json);

export default defineConfig(({ mode }) => {
  const isLibrary = mode === "library";

  return {
    plugins: [sveltekit()],
    test: {
      include: ["src/**/*.{test,spec}.{js,ts}"]
    },
    build: {
      rollupOptions: {
        // Only apply externals for library build
        external: isLibrary ? ["svelte", "firebase"] : []
      }
    },
    define: {
      PKG: pkg
    }
  };
});
