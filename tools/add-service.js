const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const [serviceName] = process.argv.slice(2);

const rootPath = path.join(__dirname, "../");
const servicesPath = path.join(rootPath, "services");

function isServiceName(serviceName) {
  return (
    typeof serviceName === "string" &&
    /^[a-z]([-]?[a-z0-9]+)*$/.test(serviceName)
  );
}

function isDuplicated(serviceName) {
  const services = fs.readdirSync(servicesPath);
  return services.some((name) => name === serviceName);
}

if (!isServiceName(serviceName)) {
  console.error(
    `The service name '${serviceName}' should match with /^[a-z]([-]?[a-z0-9]+)*$/`,
  );
  process.exit(1);
}

if (isDuplicated(serviceName)) {
  console.error(`The service name '${serviceName}' already exists.`);
  process.exit(1);
}

const servicePath = path.join(servicesPath, serviceName);
const binPath = path.join(rootPath, "node_modules/.bin");
const packageName = "@coops/" + serviceName;

fs.mkdirSync(servicePath, { recursive: true });

const templates = {
  files: {
    "package.json": JSON.stringify({
      name: packageName,
      private: true,
    }),
  },
  dirs: ["src"],
};

for (const dirname of templates.dirs) {
  fs.mkdirSync(path.join(servicePath, dirname), { recursive: true });
}

for (const [filename, body] of Object.entries(templates.files)) {
  fs.writeFileSync(path.join(servicePath, filename), body);
}

childProcess.exec(`${path.join(binPath, "prettier")} --write ${servicePath}`);
childProcess.exec(
  `npm set-script ${serviceName} "yarn workspace ${packageName}"`,
);
console.log(`npm script added. try 'yarn ${serviceName} init -y'`);
