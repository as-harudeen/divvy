/**
 * Used only by Jest (`jest-expo` preset) for transforming this package's source
 * during test runs. The host app supplies its own babel.config.js for Metro builds.
 */
module.exports = (api) => {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
