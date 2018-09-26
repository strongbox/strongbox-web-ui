// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-firefox-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-junit-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-summary-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, '../coverage'),
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        //reporters: ['progress', 'kjhtml'],
        reporters: ['progress', 'kjhtml', 'junit', 'summary'],
        // the default configuration
        junitReporter: {
            outputDir: '../dist/', // results will be saved as $outputDir/$browserName.xml
            outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: '', // suite will become the package name attribute in xml testsuite element
            useBrowserName: true, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
            properties: {}, // key value pair of properties to add to the <properties> section of the report
            xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
        },
        summaryReporter: {
            // 'failed', 'skipped' or 'all'
            show: 'all',
            // Limit the spec label to this length
            specLength: 50,
            // Show an 'all' column as a summary
            overviewColumn: true
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['HeadlessChrome', 'Chrome', 'HeadlessFirefox', 'Firefox'],
        customLaunchers: {
            // This is necessary because of a bug:
            // https://github.com/karma-runner/karma-chrome-launcher/issues/154#issuecomment-334524420
            HeadlessChrome: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox', '--headless', '--disable-gpu'
                ]
            },
            HeadlessFirefox: {
                base: 'Firefox',
                flags: [
                    '-headless'
                ],
            },
        },
        browserNoActivityTimeout: 300000,
        singleRun: true
    });
};