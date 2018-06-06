const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const helmet = require('helmet');
const path = require('path');

const appConfig = require('./config/app-config');
const globalErrorMiddleware = require('./middlewares/app-error-handler');
const routeLoggerMiddleware = require('./middlewares/route-logger');
const authMiddleware = require('./middlewares/auth');
const logger = require('./libs/logger');

const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use(globalErrorMiddleware.errorHandler);
app.use(routeLoggerMiddleware.log);

let modelsPath = './models';
fs.readdirSync(modelsPath).forEach((file) => {
  if (~file.indexOf('.js')) {
    logger.log(file);
    require(modelsPath + '/' + file);
  }
});

const baseUrl = `${appConfig.apiVersion}`;

app.use(baseUrl + '/products', productRoutes);
app.use(baseUrl + '/customers', customerRoutes);
app.use(baseUrl + '/admin', adminRoutes);

app.use(baseUrl + '/orders', authMiddleware.customerAuthenticated, orderRoutes);
app.use(baseUrl + '/cart', authMiddleware.customerAuthenticated, cartRoutes);

app.use('/apidoc', express.static(path.join(__dirname, 'doc')));
app.get('/apidoc', (req, res) => {
  res.sendFile(path.join(__dirname, 'doc/index.html'));
});

app.use('*', globalErrorMiddleware.notFoundHandler);

module.exports = app;