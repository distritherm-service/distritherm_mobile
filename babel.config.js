module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo"],
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@assets': './assets',
            'src': './src',
            '@/reservations': './src/services/reservationsService',
            '@/pro-account': './src/services/proAccountService',
          },
        },
      ],
    ],
  };
};