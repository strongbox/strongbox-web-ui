const protractor = require('./protractor.conf');

const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
        args: ["--headless", "--disable-gpu", "--window-size=800,600"]
    }
};

let config = Object.assign({}, protractor.config);
config.capabilities = capabilities;

exports.config = config;
