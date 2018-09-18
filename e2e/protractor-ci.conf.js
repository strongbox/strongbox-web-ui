process.env.CHROME_BIN = require('puppeteer').executablePath();

const protractor = require('./protractor.conf');

// Currently can't be used:
//  WebDriverError: invalid argument: can't kill an exited process
//  From: Task: WebDriver.createSession()
const firefox = {
    browserName: 'firefox',
    'moz:firefoxOptions': {
        args: ["--no-sandbox", '--headless']
    }
};

const chrome = {
    browserName: 'chrome',
    chromeOptions: {
        args: ["--no-sandbox", "--headless", "--disable-gpu", "--disable-software-rasterizer", "--disable-dev-shm-usage", "--window-size=800,600"]
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
