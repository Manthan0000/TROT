// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
      presets: ["babel-preset-expo"],
      plugins: [
        // Keep Expo Router plugin enabled implicitly via app entry; no extra config needed
      ],
    };
  };
