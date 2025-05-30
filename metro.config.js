const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@assets': path.resolve(__dirname, 'assets'),
};

// Configuration pour la nouvelle architecture React Native
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Amélioration de la gestion des modules natifs
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Supprimer les logs de warning spécifiques à expo-linear-gradient
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    (args[0].includes('ExpoLinearGradient') || 
     args[0].includes('NativeViewManagerAdapter') ||
     args[0].includes("isn't exported by expo-modules-core") ||
     args[0].includes('Views of this type may not render correctly'))
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Configuration pour éviter les conflits de modules
config.resolver.blacklistRE = /node_modules\/.*\/node_modules\/react-native\/.*/;

module.exports = config;