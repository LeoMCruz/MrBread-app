const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuração para resolver problemas de URL
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configuração para SVG
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
};

module.exports = withNativeWind(config, { input: './global.css' });