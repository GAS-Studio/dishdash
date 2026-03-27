const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Force Metro to resolve zustand to CJS instead of ESM for web
// This fixes the "Cannot use 'import.meta' outside a module" error
const zustandPath = path.dirname(require.resolve('zustand/package.json'));

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // For web platform, force zustand to use CJS
  if (platform === 'web') {
    if (moduleName === 'zustand') {
      return {
        filePath: path.join(zustandPath, 'index.js'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'zustand/middleware') {
      return {
        filePath: path.join(zustandPath, 'middleware.js'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'zustand/vanilla') {
      return {
        filePath: path.join(zustandPath, 'vanilla.js'),
        type: 'sourceFile',
      };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
