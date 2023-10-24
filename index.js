// The @semantic-release/npm plugin maintains
// some state at the module level to decide where to
// store its .npmrc file.
// Because of this, we have to monkey around a bit with
// Node's require cache in order to create multiple copies
// of the module in order to use it with different configurations.
const registryPlugins = {};
async function getChildPlugin(registryName) {
  let plugin = registryPlugins[registryName];
  if (!plugin) {
    plugin = await import('@semantic-release/npm');
    registryPlugins[registryName] = plugin;
  }

  return plugin;
}

function createCallbackWrapper(callbackName) {
  return async ({ registries, ...pluginConfig }, context) => {
    for (const [registryName, childConfig] of Object.entries(
      registries || {},
    )) {
      const callback = (await getChildPlugin(registryName))[callbackName];
      if (!callback) {
        return;
      }

      context.logger.log(
        `Performing ${callbackName} for registry ${registryName}`,
      );

      const environmentVariablePrefix = `${registryName.toUpperCase()}_`;
      const { env } = context;
      const childEnv = { ...env };

      for (const variableName of [
        'NPM_TOKEN',
        'NPM_USERNAME',
        'NPM_PASSWORD',
        'NPM_EMAIL',
        'NPM_CONFIG_REGISTRY',
        'NPM_CONFIG_USERCONFIG',
      ]) {
        const overridenValue = env[environmentVariablePrefix + variableName];
        if (overridenValue) {
          childEnv[variableName] = overridenValue;
        }
      }

      await callback(
        { ...childConfig, ...pluginConfig },
        { ...context, env: childEnv },
      );
    }
  };
}

const callbackNames = ['verify', 'prepare', 'publish', 'success', 'fail'];

export default Object.assign(
  {},
  ...callbackNames.map(name => ({ [name]: createCallbackWrapper(name) })),
);
