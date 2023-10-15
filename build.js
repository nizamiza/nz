import { exec as unpromisifiedExec } from "child_process";
import { promisify } from "util";
import { copyFile, mkdir, rm, writeFile } from "fs/promises";
import packageJson from "./package.json" assert { type: "json" };

const exec = promisify(unpromisifiedExec);

await rm("./dist", {
  force: true,
  recursive: true,
});

await exec("npx tsc");

delete packageJson.scripts;

await writeFile(
  "./dist/package.json",
  JSON.stringify(
    {
      ...packageJson,
      main: "./core/bootstrap.js",
    },
    null,
    2,
  ),
);

await copyFile("./README.md", "./dist/README.md");
await copyFile("./lib/index.d.ts", "./dist/index.d.ts");

await copyFile("./lib/nz-head/nz-head.html", "./dist/lib/nz-head/nz-head.html");

await mkdir("./dist/lib/core/templates", {
  recursive: true,
});

await copyFile(
  "./lib/core/templates/loading.html",
  "./dist/lib/core/templates/loading.html",
);
await copyFile(
  "./lib/core/templates/bootstrap.html",
  "./dist/lib/core/templates/bootstrap.html",
);
