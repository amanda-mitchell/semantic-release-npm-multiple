module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [require('./index'), { registries: { public: {}, github: {} } }],
    '@semantic-release/github',
  ],
};
