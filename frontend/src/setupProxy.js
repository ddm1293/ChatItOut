const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/**',
    createProxyMiddleware({
      target: 'https://chatitout-chatbot.onrender.com',
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'https://chatitout.onrender.com';
      },
    })
  );
};