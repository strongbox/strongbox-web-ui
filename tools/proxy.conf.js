const LOCAL_IP = '127.0.0.1';

const proxyEndpoints = [
  "/api",
  "/storages"
];

const PROXY_CONFIG = [
  {
    context: function(pathname, req) {
      return req.method === 'GET' && (
          pathname.match('^/(index\.html)?$') ||
          !pathname.match('^' + proxyEndpoints.join("|") + '|/static')
      )
    },
    target: `http://${LOCAL_IP}:4200/static/assets`,
    secure: false,
    logLevel: "debug"
  },
  {
    context: proxyEndpoints,
    target: `http://${LOCAL_IP}:48080`,
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  }
];

module.exports = PROXY_CONFIG;
