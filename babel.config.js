function getModuleType() {
  if (process.env.BABEL_ENV === 'cjs') {
    return 'commonjs';
  }
  return false;
}

module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      '@babel/plugin-transform-runtime'
    ],
    presets: [
      ['@babel/preset-env', {
        modules: getModuleType()
      }],
      '@babel/preset-react'
    ]
  };
};
