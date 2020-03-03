const filter = function(pathname, req) {
  return req.method === 'GET' && pathname.match('^/(index\.html)?$')
};

const LOCAL_IP = '127.0.0.1';

const PROXY_CONFIG = [
  {
    context: filter,
    target: `http://${LOCAL_IP}:4200/static/assets`,
    secure: false,
    logLevel: "debug"
  },
  {
    context: [
      "/api",
      "/storages"
    ],
    target: `http://${LOCAL_IP}:48080`,
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  }
];

module.exports = PROXY_CONFIG;
