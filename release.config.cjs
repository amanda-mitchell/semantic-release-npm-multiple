module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [require('./index.js'), { registries: { github: {}, public: {} } }],
    '@semantic-release/github',
  ],
};
