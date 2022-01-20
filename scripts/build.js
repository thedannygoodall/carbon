const childProcess = require("child_process");
const path = require("path");
const { promisify } = require("util");

const exec = promisify(childProcess.exec);

async function run(argv) {
  const { bundle, verbose } = argv;

  const env = {
    NODE_ENV: "production",
    BABEL_ENV: bundle,
  };

  const babelConfigPath = path.resolve(__dirname, "../babel.config.js");
  const srcDir = path.resolve("./src");

  const extensions = [".js", ".ts", ".tsx"];
  const ignore = [
    "**/*.test.js",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.js",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/*.d.ts",
  ];

  const outDir = path.resolve(
    {
      cjs: "./lib",
      esm: "./esm",
    }[bundle]
  );

  const babelArgs = [
    "--config-file",
    babelConfigPath,
    "--extensions",
    `"${extensions.join(",")}"`,
    srcDir,
    "--out-dir",
    outDir,
    "--ignore",
    `"${ignore.join('","')}"`,
  ];

  const command = ["cross-env babel", ...babelArgs].join(" ");

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log(`running '${command}' with ${JSON.stringify(env)}`);
  }

  const { stderr, stdout } = await exec(command, {
    env: { ...process.env, ...env },
  });

  if (stderr) {
    throw new Error(`'${command}' failed with \n${stderr}`);
  }

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log(stdout);
  }
}

run({ bundle: "esm" });
run({ bundle: "cjs" });
