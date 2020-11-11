module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [require('./index'), { registries: { github: {}, public: {} } }],
    '@semantic-release/github',
  ],
};
