import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    output: "static",
    site: env.SITE_URL ?? "http://localhost:4321",
  };
});
