module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit':
      'lint-staged && NODE_OPTIONS=--experimental-vm-modules jest --passWithNoTests -o',
  },
};
