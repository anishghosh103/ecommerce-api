const jwt = require('jsonwebtoken');

const appConfig = require('../config/app-config');
const response = require('../libs/response-template');

const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

let customerAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.json(response.error('You are not authorized to access this page.', 403));
  } else {
    jwt.verify(token, appConfig.secret, (err, decoded) => {
      if (err || !decoded || decoded.userType !== 'customer') {
        res.json(response.error('You are not authorized to access this page.', 403));
      } else {
        Customer.findOne({ customerId: decoded.customerId }, (err, customer) => {
          if (err) {
            res.json(response.error('You are not authorized to access this page.', 403));
          } else {
            req.customer = customer;
            next();
          }
        });
      }
    });
  }
};

let adminAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.json(response.error('You are not authorized to access this page.', 403));
  } else {
    jwt.verify(token, appConfig.secret, (err, decoded) => {
      if (err || !decoded || decoded.userType !== 'admin') {
        res.json(response.error('You are not authorized to access this page.', 403));
      } else {
        Admin.findOne({ adminId: decoded.adminId }, (err, admin) => {
          if (err) {
            res.json(response.error('You are not authorized to access this page.', 403));
          } else {
            req.admin = admin;
            next();
          }
        });
      }
    });
  }
};

module.exports = { customerAuthenticated, adminAuthenticated };