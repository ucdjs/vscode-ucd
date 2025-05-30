import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/extension.ts"],
  format: "cjs",
  outDir: "dist",
  clean: true,
  dts: false,
  external: [
    "vscode",
  ]
});
