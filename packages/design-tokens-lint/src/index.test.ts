import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { it, expect, afterEach } from 'vitest';
import packageJSON from '../package.json' with { type: 'json' };

const command = Object.values(packageJSON.bin)[0];
console.log('command', command);
const startLintProcess = async (
  args?: string[],
): Promise<{
  process: ChildProcessWithoutNullStreams;
  output: string;
  errorOutput: string;
  started: boolean;
  exitState: number;
}> => {
  const env = { ...process.env };

  // Use process.execPath to get the absolute path to the Node.js executable
  // This satisfies security requirements by avoiding PATH lookup while remaining
  // cross-platform compatible (works with nvm, system Node, Docker, etc.)
  const testProcess = spawn(process.execPath, [command], { env });
  let stdoutData = '';
  let stderrData = '';
  let exitState = 0;
  const started = false;

  const startPromise = new Promise<void>((resolve) => {
    testProcess.stdout?.on('data', (data) => {
      stdoutData += data.toString();
    });
    testProcess.stderr?.on('data', (data) => {
      stderrData += data.toString();
    });

    testProcess.on('exit', (evt) => {
      console.log('exit', evt);
      if (typeof evt === 'number') {
        exitState = evt;
      }
      resolve();
    });
    testProcess.on('close', () => {
      console.log('close');
      resolve();
    });
    testProcess.on('error', () => {
      console.log('error');
      resolve();
    });
  });

  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(resolve, 3000);
  });

  await Promise.race([startPromise, timeoutPromise]);

  return { errorOutput: stderrData, exitState, output: stdoutData, process: testProcess, started };
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

let runningProcess: ChildProcessWithoutNullStreams | null = null;

it('should start process to check a file', async () => {
  const { output, process: testProcess, started } = await startLintProcess(['test/invalid/tokens.json']);
  runningProcess = testProcess;

  expect(started).toBe(true);
  expect(output).toContain('Starting Theme Wizard server...');
  expect(output).toContain('http://[::]:9999');

  await stopServer(testProcess);
});

it('should execute with default port 8080 when PORT env is not set', async () => {
  const { output, process: testProcess, started } = await startServer();
  runningProcess = testProcess;

  expect(started).toBe(true);
  expect(output).toContain('Starting Theme Wizard server...');
  expect(output).toContain('http://[::]:8080/');

  await stopServer(testProcess);
});

afterEach(() => {
  if (runningProcess) {
    stopServer(runningProcess);
  }
});
