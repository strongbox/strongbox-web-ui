const findChromeVersion = require("find-chrome-version");
const exec = require("child_process").exec;

(async () => {
    const chromeVersion = await findChromeVersion();
    console.log(`Installed Chrome version is ${chromeVersion}`);

    exec(`webdriver-manager update -versions.chrome ${chromeVersion}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`\n${stdout}`);
        console.error(`\n${stderr}`);
    });
})();
