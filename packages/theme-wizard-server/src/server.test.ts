import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { it, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageDir = join(__dirname, '..');
const serverPath = join(packageDir, 'dist/server.js');

const startServer = async (
  port?: number,
): Promise<{
  process: ChildProcessWithoutNullStreams;
  output: string;
  started: boolean;
}> => {
  const env = { ...process.env };
  if (port === undefined) {
    delete env['PORT'];
  } else {
    env['PORT'] = String(port);
  }

  const testProcess = spawn('node', [serverPath], { env });
  let stdoutData = '';
  let started = false;

  const startPromise = new Promise<void>((resolve) => {
    testProcess.stdout?.on('data', (data) => {
      stdoutData += data.toString();
      if (stdoutData.includes('Starting Theme Wizard server')) {
        started = true;
        resolve();
      }
    });
  });

  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(resolve, 3000);
  });

  await Promise.race([startPromise, timeoutPromise]);

  return { output: stdoutData, process: testProcess, started };
};

const stopServer = async (testProcess: ChildProcessWithoutNullStreams): Promise<void> => {
  testProcess.kill('SIGINT');

  await new Promise<void>((resolve) => {
    const exitHandler = () => {
      testProcess.removeListener('exit', exitHandler);
      resolve();
    };
    testProcess.on('exit', exitHandler);
    setTimeout(() => {
      testProcess.removeListener('exit', exitHandler);
      resolve();
    }, 2000);
  });
};

it('should execute as a standalone file and start the server on custom port', async () => {
  const { output, process: testProcess, started } = await startServer(9999);

  expect(started).toBe(true);
  expect(output).toContain('Starting Theme Wizard server');
  expect(output).toContain('http://localhost:9999');

  await stopServer(testProcess);
});

it('should execute with default port 8080 when PORT env is not set', async () => {
  const { output, process: testProcess, started } = await startServer();

  expect(started).toBe(true);
  expect(output).toContain('Starting Theme Wizard server');
  expect(output).toContain('http://localhost:8080');

  await stopServer(testProcess);
});
