
module.exports = {
  port: 3000,
  allowedCorsOrigin: '*',
  env: 'dev',
  db: {
    uri: 'mongodb://127.0.0.1:27017/ecommerceAppDB'
  },
  apiVersion: '/api/v1',
  secret: 'secretkey'
};