const fs = require("fs");
const path = require("path");

const { ENV } = process.env;

const isDevelopment = ENV === "development";

const build = (rootPath) => {
  const outPath = path.join(rootPath, "dist");
  const srcPath = path.join(rootPath, "./src");
  const files = fs.readdirSync(srcPath);

  const recFileMap = (root, file) => {
    const filePath = path.join(root, file);
    return fs.lstatSync(filePath).isDirectory()
      ? fs
          .readdirSync(filePath)
          .map((child) => recFileMap(filePath, child))
          .flat()
      : filePath;
  };

  const entryPoints = files.map((file) => recFileMap(srcPath, file)).flat();

  for (const entryPoint of entryPoints) {
    const entry = path.relative(rootPath, entryPoint);

    console.log(" -", entry);
  }

  require("esbuild").buildSync({
    entryPoints,
    platform: "node",
    target: "node16",
    format: "cjs",
    sourcemap: isDevelopment ? "external" : undefined,
    minify: !isDevelopment,
    outdir: outPath,
  });
};

module.exports = build;
