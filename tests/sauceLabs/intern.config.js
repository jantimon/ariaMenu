/**
 * This file contains the intern configuration.
 * @see http://theintern.io
 *
 *
 */



/* global define: false */
// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define({
  // The port on which the instrumenting proxy will listen
  proxyPort: 9000,

  // A fully qualified URL to the Intern proxy
  proxyUrl: 'http://localhost:9000/',

  // Note that the `build` capability will be filled in with the current commit ID from the Travis CI environment
  // automatically
  capabilities: {
  },

  environments: [
//    { browserName: 'android', 'version': '4.0', platform: 'Linux', 'tags': ['mobile'] },
   { browserName: 'internet explorer', version: '9', platform: 'Windows 7', 'tags': ['mouse'] },
//   { browserName: 'internet explorer', version: '10', platform: 'Windows 8', 'tags': ['mouse'] },
//   { browserName: 'internet explorer', version: '11', platform: 'Windows 8.1', 'tags': ['mouse'] },
    { browserName: '', device: 'iPhone Simulator', app: 'safari', 'version': '6.1', 'tags': ['touch'] },
    { browserName: 'firefox', version: '25', platform: [ 'OS X 10.6', 'Windows 7' ], 'tags': ['mouse', 'keyboard'] },
    { browserName: 'chrome', version: '', platform: [ 'Linux', 'OS X 10.6', 'Windows 7' ], 'tags': ['mouse', 'keyboard'] },
    { browserName: 'firefox', version: '24', platform: 'Linux', 'tags': ['mouse', 'keyboard'] }
  ],

  // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
  maxConcurrency: 3,

  // Whether or not to start Sauce Connect before running tests
  useSauceConnect: true,

  // Connection information for the remote WebDriver service. If using Sauce Labs, keep your username and password
  // in the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables unless you are sure you will NEVER be
  // publishing this configuration file somewhere
  webdriver: {
    host: 'localhost',
    port: 4444
  },

  // The desired AMD loader to use when running unit tests (client.html/client.js). Omit to use the default Dojo
  // loader
  useLoader: {
    'host-node': 'dojo/dojo',
    'host-browser': 'node_modules/dojo/dojo.js'
  },

  // Configuration options for the module loader; any AMD configuration options supported by the specified AMD loader
  // can be used here
  loader: {
    // Packages that should be registered with the loader in each testing environment
    packages: [
      { name: 'ariaMenu', location: './dist' },
      { name: 'dojo', location: './node_modules/intern/node_modules/dojo'}
    ]
  },

  reporters: [
    'console',
    'lcov',
    'runner'
  ],

  // Non-functional test suite(s) to run in each browser
  suites: [ /* 'myPackage/tests/foo', 'myPackage/tests/bar' */ ],

  // Functional test suite(s) to run in each browser once non-functional tests are completed
  functionalSuites: [ 'tests/sauceLabs/functional/test.js' ],

  // A regular expression matching URLs to files that should not be included in code coverage analysis
  excludeInstrumentation: /^tests\//
});