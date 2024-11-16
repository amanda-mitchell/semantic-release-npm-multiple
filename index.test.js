import { mkdtemp, rmdir } from 'fs/promises';
import { addChannel, prepare, publish, verifyConditions } from './index.js';
import * as underlyingPlugin from '@semantic-release/npm';

let workingDirectory;

beforeAll(async () => {
  workingDirectory = await mkdtemp('.');
});

afterAll(async () => {
  await rmdir(workingDirectory, { recursive: true });
});

const createPluginConfig = () => ({
  registries: { github: {}, public: {} },
  npmPublish: false,
});

const createContext = () => ({
  logger: console,
  env: {},
  nextRelease: { version: '1.0' },
  cwd: workingDirectory,
});

describe('addChannel', () => {
  it('does not crash', async () => {
    await addChannel(createPluginConfig, createContext);
  });
});

describe('underlying plugin endpoints', () => {
  it('has the expected set of keys', () => {
    expect(new Set(Object.keys(underlyingPlugin))).toEqual(
      new Set(['addChannel', 'prepare', 'publish', 'verifyConditions']),
    );
  });
});

describe('prepare', () => {
  it('does not crash', async () => {
    await prepare(createPluginConfig, createContext);
  });
});

describe('publish', () => {
  it('does not crash', async () => {
    await publish(createPluginConfig, createContext);
  });
});

describe('verifyConditions', () => {
  it('does not crash', async () => {
    await verifyConditions(createPluginConfig, createContext);
  });
});
