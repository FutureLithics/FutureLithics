module.exports = {
  root: true,
  extends: ['react-app'],
  ignorePatterns: ['node_modules/**/*'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react']
    }
  }
};
