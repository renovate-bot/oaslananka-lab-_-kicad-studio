import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { resolveKiCadExecutable } from '../../src/commands/kicadLauncher';
import { __setConfiguration } from './vscodeMock';

jest.mock('node:child_process', () => ({
  ...jest.requireActual<typeof import('node:child_process')>(
    'node:child_process'
  ),
  spawn: jest.fn(),
  spawnSync: jest.fn()
}));

jest.mock('node:fs', () => ({
  ...jest.requireActual<typeof import('node:fs')>('node:fs'),
  existsSync: jest.fn(),
  statSync: jest.fn()
}));

describe('kicadLauncher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __setConfiguration({
      'kicadstudio.kicadPath': '/broken/kicad'
    });
  });

  it('continues to PATH probing when the configured path cannot be statted', () => {
    const fallback =
      process.platform === 'win32'
        ? 'C:\\KiCad\\bin\\kicad.exe'
        : '/usr/bin/kicad';
    (fs.statSync as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('broken symlink');
    });
    (fs.existsSync as unknown as jest.Mock).mockReturnValue(false);
    (childProcess.spawnSync as unknown as jest.Mock).mockReturnValue({
      status: 0,
      stdout: `${fallback}\n`,
      stderr: ''
    });

    expect(resolveKiCadExecutable('/project/board.kicad_pcb')).toEqual({
      command: fallback,
      args: []
    });
    expect(fs.statSync).toHaveBeenCalledWith(path.normalize('/broken/kicad'));
    expect(childProcess.spawnSync).toHaveBeenCalled();
  });
});
