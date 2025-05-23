const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@assets': path.resolve(__dirname, 'assets'),
};

module.exports = config;