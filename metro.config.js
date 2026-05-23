const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const defaultResolveRequest = defaultConfig.resolver?.resolveRequest;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      // v4 resolves "import" to index.mjs, which pulls react-dom. CJS entry uses .native.js.
      if (moduleName === '@tanstack/react-query') {
        return {
          type: 'sourceFile',
          filePath: path.resolve(
            __dirname,
            'node_modules/@tanstack/react-query/build/lib/index.js',
          ),
        };
      }

      if (defaultResolveRequest) {
        return defaultResolveRequest(context, moduleName, platform);
      }

      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
