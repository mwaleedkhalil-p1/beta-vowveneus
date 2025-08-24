import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runCommand(command) {
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

async function build() {
  console.log('Installing dependencies...');
  await runCommand('npm install');

  console.log('Building client...');
  await runCommand('npm run build:client');

  console.log('Building server...');
  await runCommand('npm run build:server');
}

build().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
