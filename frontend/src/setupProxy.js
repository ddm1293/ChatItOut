const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/**',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'https://chatitout.onrender.com';
      },
    })
  );
};