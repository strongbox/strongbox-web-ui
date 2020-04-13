const LOCAL_IP = '127.0.0.1';

const backend = [
    "/api",
    "/storages"
];

const PROXY_CONFIG = [
  {
    // don't forward when path matches /static/assets or backend endpoints to prevent infinity loop.
    context: function(pathname) {
      const ignored = ["/static/assets", ...backend].join("|").replace(/\//g, "\\/");
      const matchesIgnored = new RegExp(`^${ignored}`).test(pathname);
      return matchesIgnored === false;
    },
    target: `http://${LOCAL_IP}:4200/static/assets`,
    secure: false,
    logLevel: "info"
  },
  {
    context: backend,
    target: `http://${LOCAL_IP}:48080`,
    secure: false,
    logLevel: "info",
    changeOrigin: true
  }
];

console.log();
console.log('\x1b[35m%s\x1b[0m', 'Note: You need to have a running Strongbox instance for the UI to work!');
console.log("https://strongbox.github.io/developer-guide/building-strongbox-using-strongbox-instance.html#starting-a-strongbox-instance");
console.log();
console.log();
console.log();

module.exports = PROXY_CONFIG;
