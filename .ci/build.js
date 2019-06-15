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

let {
  SYSTEM_TEAMFOUNDATIONCOLLECTIONURI,
  SYSTEM_TEAMPROJECT
} = process.env;

function error(msg) {
  console.error(msg);
  process.exit(1);
}

async function npmInstallEsy() {
  let esy = `esy@${ESY_VERSION}`;
  await run('npm', 'install', '--global', esy);
}

async function fetchLatestBuild({branchName}) {
  let params = {
    'branchName': `refs/heads/${branchName}`,
    // filter succeded and completed builds
    'deletedFilter': 'excludeDeleted',
    'statusFilter': 'completed',
    'resultFilter': 'succeeded'
    // get latest
    'queryOrder': 'finishTimeDescending',
    '$top': '1',
    'api-version': '4.1'
  };
  let apiRoot = `${SYSTEM_TEAMFOUNDATIONCOLLECTIONURI}`
  let projName = `${SYSTEM_TEAMPROJECT}`
  let url = `${apiRoot}/${projName}/_apis/build/builds?${encodeParams(params)}`
}

async function restoreCache() {
  await fetchLatestBuild({branchName: 'master'})
}

async function esyInstall() {
  return;
  await run('esy', 'install');
}

async function esyBuild() {
  return;
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
