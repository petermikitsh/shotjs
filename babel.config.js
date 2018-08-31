module.exports = function (api) {
  api.cache(true);

  return {
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-runtime'
    ],
    presets: [
      ['@babel/preset-env', {
        targets: {
          browsers: [
            'last 4 versions',
            'Android >= 4.4',
            'Chrome >= 49',
            'Edge >= 12',
            'Firefox >= 51',
            'IE >= 11',
            'iOS >= 8.4',
            'Safari >= 8'
          ]
        }
      }],
      '@babel/preset-react'
    ]
  };
};
