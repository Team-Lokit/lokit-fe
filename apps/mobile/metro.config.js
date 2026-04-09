const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const workspaceRoot = path.resolve(__dirname, '../..');
const projectRoot = __dirname;

const defaultConfig = getDefaultConfig(projectRoot);

const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    ...defaultConfig.resolver,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    disableHierarchicalLookup: true,
    extraNodeModules: {
      react: path.resolve(projectRoot, 'node_modules/react'),
      'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
      'react-native-safe-area-context': path.resolve(
        projectRoot,
        'node_modules/react-native-safe-area-context',
      ),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
