const npmPlugin = require('@semantic-release/npm');

function wrapCallback(callback) {
  return (pluginConfig, context) => {
    for (const [prefix, childConfig] of Object.entries(pluginConfig)) {
      const fullPrefix = `${prefix.toUpperCase}_`;
      const { env } = context;
      const chilldEnv = { ...env };

      for (const variableName of [
        'NPM_TOKEN',
        'NPM_USERNAME',
        'NPM_PASSWORD',
        'NPM_EMAIL',
        'NPM_CONFIG_REGISTRY',
      ]) {
        const overridenValue = env[fullPrefix + variableName];
        if (overridenValue) {
          childEnv[variableName] = overridenValue;
        }
      }

      callback(childConfig, { ...context, childEnv });
    }
  };
}

module.exports = Object.assign(
  {},
  ...Object.entries(npmPlugin).map(([callbackName, callback]) => ({
    [callbackName]: wrapCallback(callback),
  }))
);
