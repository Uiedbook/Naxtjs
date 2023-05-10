import type { Options } from "tsup";

const config: Options = {
  entry: ["lib/ssr.ts"],
  dts: true,
  clean: true,
  format: ["esm"],
  // format: ["cjs", "esm"],
};

export default config;
