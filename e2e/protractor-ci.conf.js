const protractor = require('./protractor.conf');

const capabilities = {
    'browserName': 'firefox',
    'moz:firefoxOptions': {
        args: ['-headless']
    }
};

const multiCapabilities = [
    {
        'browserName': 'firefox',
        'moz:firefoxOptions': {
            args: ['-headless']
        }
    },
    {
        'browserName': 'chrome',
        chromeOptions: {
            args: ["--headless", "--disable-gpu", "--window-size=800,600"]

        }
    }
];

let config = Object.assign({}, protractor.config);
config.capabilities = capabilities;
//config.multiCapabilities = multiCapabilities;

exports.config = config;
