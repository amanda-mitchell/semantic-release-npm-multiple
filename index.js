const underlyingPluginSpecifier = '@semantic-release/npm';

// We use the safe navigation operator because when this module
// is executed by jest, import.meta.resolve is unavailable.
const resolvedNpm = import.meta.resolve?.(underlyingPluginSpecifier);

const registryPlugins = {};
async function getChildPlugin(registryName) {
  let plugin = registryPlugins[registryName];
  if (!plugin) {
    // What's going on here?
    //
    // @semantic-release/npm maintains some module-level state (specifically,
    // a temporary file that acts as an npmrc), which means that we can't just
    // call the same plugin lifecycle methods repeatedly because they would
    // stomp on the shared state.
    //
    // Fortunately, node has a way to deliberately suppress its normal module
    // caching behavior, which allows us to load multiple copies of a single module:
    // by appending a query string to the specifier, node will load one copy of the
    // module per query string.
    //
    // But there's a twist: node *doesn't* support this behavior on "bare specifiers",
    // which is how we usually import other packages. In order to get around this,
    // we must use import.meta.resolve in order to transform the bare specifier into
    // a file url specifier.
    //
    // But then there's a double twist! Jest doesn't support import.meta.resolve, but
    // it *does* support query strings on bare specifiers. So in order to be compatible
    // with both tests and actual usage, we have this unsightly kludge.
    const importSpecifier = `${resolvedNpm || underlyingPluginSpecifier}?registry=${encodeURIComponent(registryName)}`;

    plugin = import(importSpecifier);
    registryPlugins[registryName] = plugin;
  }

  return await plugin;
}

function createCallbackWrapper(callbackName) {
  return async ({ registries, ...pluginConfig }, context) => {
    for (const [registryName, childConfig] of Object.entries(
      registries || {},
    )) {
      const plugin = await getChildPlugin(registryName);

      const callback = plugin[callbackName];
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

export default {
  addChannel: createCallbackWrapper('addChannel'),
  prepare: createCallbackWrapper('prepare'),
  publish: createCallbackWrapper('publish'),
  verifyConditions: createCallbackWrapper('verifyConditions'),
};
