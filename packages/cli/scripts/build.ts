import consola from "consola";

const start = performance.now();

const glob = new Bun.Glob("dist/**/*");

for await (const file of glob.scan()) {
  await Bun.file(file).delete();
}

await Bun.build({
  entrypoints: ["src/cli.ts"],
  outdir: "./dist",
  plugins: [],
  minify: true,
  target: "node",
});

consola.info(`Built in ${(performance.now() - start).toFixed(0)}ms`);
