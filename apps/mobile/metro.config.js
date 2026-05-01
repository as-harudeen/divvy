const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo so Metro picks up live changes in packages/*
config.watchFolders = [workspaceRoot];

// Resolve modules from both the app's and the workspace root's node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// With shamefully-hoist=true, packages are hoisted to root node_modules —
// hierarchical lookup ensures Metro can resolve transitive deps from .pnpm paths

module.exports = withNativeWind(config, { input: './src/global.css' });
