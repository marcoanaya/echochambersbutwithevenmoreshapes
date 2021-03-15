module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
  },
  plugins: [
    'react',
    'babel',
  ],
  parser: 'babel-eslint',
  rules: {
    'no-param-reassign': 'off',
    'no-undef': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-console': 'off',
    'no-nested-ternary': 'off',
    'no-invalid-this': 0,
    'babel/no-invalid-this': 1,
    'react/state-in-constructor': 'off',
  },
};
