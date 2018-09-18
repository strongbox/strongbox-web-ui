const protractor = require('./protractor.conf');

// Currently can't be used:
//  WebDriverError: invalid argument: can't kill an exited process
//  From: Task: WebDriver.createSession()
const firefox = {
    browserName: 'firefox',
    'moz:firefoxOptions': {
        args: ['--headless']
    }
};

const chrome = {
    browserName: 'chrome',
    chromeOptions: {
        args: ["--no-sandbox", "--headless", "--disable-gpu"]
    }
};

const multiCapabilities = [
    chrome,
    firefox
];

let config = Object.assign({}, protractor.config);
config.capabilities = chrome;
//config.multiCapabilities = multiCapabilities;

exports.config = config;
