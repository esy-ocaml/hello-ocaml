let child_process = require('child_process');
let process = require('process');

class RunCommandError extends Error {
  constructor(code) {
    super(`Command failed with exit code: ${code}`);
  }
}

function waitForChildProcess(child) {
  return new Promise((resolve, reject) => {
    child.addListener("error", reject);
    child.addListener("exit", (code) => {
      if (code !== 0) {
        reject(new RunCommandError('ccmd', code));
      } else {
        resolve();
      }
    });
  });
}

function run(...line) {
  let [cmd, ...args] = line;
  let cp = child_process.spawn(cmd, args, {stdio: 'inherit'});
  return waitForChildProcess(cp)
}

ESY_VERSION = 'latest'

function error(msg) {
  console.error(msg);
  process.exit(1);
}

async function npmInstallEsy() {
  let esy = `esy@${ESY_VERSION}`;
  await run('npm', 'install', '--global', esy);
}

function esyInstall() {
  await run('esy', 'install');
}

function esyBuild() {
  await run('esy', 'build');
}


let commands = {
  npmInstallEsy, esyBuild, esyInstall
}

async function main() {
  let [commandName] = process.argv.slice(2);
  if (commandName == null || !commands.hasOwnProperty(commandName)) {
    error(`No command provided, available: ${Object.keys(commands).join(', ')}`);
  }
  let command = commands[commandName];
  await command();
}

main().catch((err) => {
  if (!(err instanceof RunCommandError)) {
    console.error(err);
  }
  process.exit(1);
});
