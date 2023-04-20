import { defineConfig } from "tsup";


export default defineConfig({
    clean: true,
    dts: true,
    minify: true,
    entry: ["data/seed.ts"],
    format: ["cjs"],
    outDir: "./data/dist",
})