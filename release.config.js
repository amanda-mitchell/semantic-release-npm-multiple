export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      (await import('./index.js')).default,
      { registries: { github: {}, public: {} } },
    ],
    '@semantic-release/github',
  ],
};
