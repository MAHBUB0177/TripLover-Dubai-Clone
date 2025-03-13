const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/images',
    createProxyMiddleware({
      target: 'https://tlluploaddocument.s3.ap-southeast-1.amazonaws.com',
      changeOrigin: true,
    })
  );


};