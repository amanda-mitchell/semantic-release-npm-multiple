export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      (await import('@amanda-mitchell/semantic-release-npm-multiple')).default,
      { registries: { github: {}, public: {} } },
    ],
    '@semantic-release/github',
  ],
};
