import { readFile, writeFile } from "fs/promises";
const res = await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
});
if (!res.success) {
  console.log(...res.logs);
} else {
  const code = await readFile("src/client.min.js", {
    encoding: "utf-8",
  });
  await writeFile("dist/client.min.js", code);
  const build = Bun.spawn(["./pack"]);
  await build.exited;
  console.log("Naxt: compiled!");
}
export {};
