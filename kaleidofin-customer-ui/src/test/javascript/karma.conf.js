process.env.CHROMIUM_BIN = require('puppeteer').executablePath();

const webpackConfig = require('../../../webpack/webpack.test.js');

const WATCH = process.argv.includes('--watch');

module.exports = (config) => {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'intl-shim'],

        // list of files / patterns to load in the browser
        files: [
            'spec/entry.ts'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'spec/entry.ts': ['webpack', 'sourcemap']
        },

        webpack: webpackConfig(WATCH),

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots', 'junit', 'progress', 'karma-remap-istanbul', 'notify'],

        junitReporter: {
            outputFile: '../../../../build/test-results/karma/TESTS-results.xml'
        },

        notifyReporter: {
            reportEachFailure: true, // Default: false, will notify on every failed sepc
            reportSuccess: true // Default: true, will notify when a suite was successful
        },

        remapIstanbulReporter: {
            dir: require('path').join(__dirname, 'coverage'), reports: { // eslint-disable-line
                'lcovonly': 'build/test-results/coverage/report-lcov/lcov.info',
                'html': 'build/test-results/coverage',
                'text-summary': null
            },
            reporters : [
                {type : 'lcov'}
            ]
        },
        

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: WATCH,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromiumHeadlessNoSandbox'],

        customLaunchers: {
            ChromiumHeadlessNoSandbox: {
                base: 'ChromiumHeadless',
                    // the chrome setup is voluntarily permissive to accomodate various environments (different OSes, running inside docker, etc)
                    // feel free to enable the sandbox if it doesn't cause problems for you
                    // see https://www.jhipster.tech/running-tests for informations on how to troubleshoot your karma chrome configuration
                    flags: [
                        '--no-sandbox',
                        '--disable-gpu',
                        '--remote-debugging-port=9222'
                    ],
                    debug: true
            }
        },

        // Ensure all browsers can run tests written in .ts files
        mime: {
            'text/x-typescript': ['ts','tsx']
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: !WATCH
    });
};
