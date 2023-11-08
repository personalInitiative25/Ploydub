const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://polydub-backend-7707d66a10f4.herokuapp.com',
      changeOrigin: true,
    })
  );
};
