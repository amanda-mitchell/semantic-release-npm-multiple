const { verify, prepare, publish, success, fail } = require('./index');

const pluginConfig = { registries: { github: {}, public: {} } };

describe('verify', () => {
  it('does not crash', () => {
    verify(pluginConfig, {});
  });
});

describe('prepare', () => {
  it('does not crash', () => {
    prepare(pluginConfig, {});
  });
});

// We skip this one because it's not worth
// setting up sufficient scaffolding to actually
// try publishing a package.
describe.skip('publish', () => {
  it('does not crash', () => {
    publish(pluginConfig, {});
  });
});

describe('success', () => {
  it('does not crash', () => {
    success(pluginConfig, {});
  });
});

describe('fail', () => {
  it('does not crash', () => {
    fail(pluginConfig, {});
  });
});