const { readFileSync } = require('fs')
const babelConfig = JSON.parse(readFileSync('./.babelrc', 'utf8'))

require('babel-register')(babelConfig)
require('babel-polyfill')

module.exports = {
  globalSetup: __dirname + '/src/tests/global-setup.js',
  globalTeardown: __dirname + '/src/tests/global-teardown.js'
};