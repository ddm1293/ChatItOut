const { createProxyMiddleware } = require('http-proxy-middleware');

// Allows CORS between the frontend and backend
module.exports = function(app) {
  app.use(
    '/api/**',
    createProxyMiddleware({
      target: 'https://chatitout-backend.onrender.com',
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'https://chatitout-7byl.onrender.com';
      },
    })
  );
};

// module.exports = function(app) {
//   app.use(
//     '/api/**',
//     createProxyMiddleware({
//       target: 'http://127.0.0.1:5000',
//       onProxyRes: function (proxyRes, req, res) {
//         proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
//       },
//     })
//   );
// };
