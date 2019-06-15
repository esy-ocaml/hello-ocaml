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

async function run(...line) {
  let [cmd, ...args] = line;
  let cp = child_process.spawn(cmd, args, {
    stdio: ['ignore', 'inherit', 'inherit']
  });
  await waitForChildProcess(cp)
}

async function runAndCollectStdout(...line) {
  let [cmd, ...args] = line;
  let cp = child_process.spawn(cmd, args, {
    stdio: ['ignore', 'pipe', 'inherit']
  });
  let chunks = [];
  cp.stdout.on('data', data => {
    chunks.push(data)
  });
  await waitForChildProcess(cp)
  return chunks.join('')
}

async function apiCall(path, params) {
  let url = `${path}?${encodeParams(params)}`
  console.log('-- API CALL --');
  console.log('URL:   ', path);
  console.log('PARAMS:', params)
  let data = await runAndCollectStdout('curl', url);
  console.log(data);
  return JSON.parse(data)
}

ESY_VERSION = 'latest'

let {
  SYSTEM_TEAMFOUNDATIONCOLLECTIONURI,
  SYSTEM_TEAMPROJECT
} = process.env;

let AZURE_API_ROOT = `${SYSTEM_TEAMFOUNDATIONCOLLECTIONURI}`
let AZURE_PROJECT_API_ROOT = `${AZURE_API_ROOT}/${SYSTEM_TEAMPROJECT}`
let AZURE_PROJECT_BUILDS_API_ROOT = `${AZURE_PROJECT_API_ROOT}/_apis/build/builds`

let ART_NAME = `cache-${process.env.AGENT_OS}-install`

function error(msg) {
  console.error(msg);
  process.exit(1);
}

function encodeParams(params) {
  let items = [];
  for (let name in params) {
    items.push(`${name}=${encodeURIComponent(params[name])}`);
  }
  return items.join('&');
}

async function fetchLatestBuildInfo({branchName}) {
  let params = {
    'branchName': `refs/heads/${branchName}`,
    // filter succeded and completed builds
    'deletedFilter': 'excludeDeleted',
    'statusFilter': 'completed',
    'resultFilter': 'succeeded',
    // get latest
    'queryOrder': 'finishTimeDescending',
    '$top': '1',
    'api-version': '4.1'
  };
  let data = await apiCall(`${AZURE_PROJECT_BUILDS_API_ROOT}`, params)
  return data.value[0]
}

async function fetchArtifactInfo(buildInfo) {
  let params = {
    // 'artifactName': ART_NAME,
    'api-version': '4.1'
  };
  let url = `${AZURE_PROJECT_BUILDS_API_ROOT}/${buildInfo.id}/artifacts`
  let data = await apiCall(url, params);
  return JSON.parse(data);
}

async function npmInstallEsy() {
  let esy = `esy@${ESY_VERSION}`;
  await run('npm', 'install', '--global', esy);
}

async function restoreCache() {
  let buildInfo = await fetchLatestBuildInfo({branchName: 'master'});
  let artifactsInfo = await fetchArtifactInfo(buildInfo);
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
  npmInstallEsy, esyBuild, esyInstall, restoreCache
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
