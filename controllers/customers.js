const shortid = require('shortid');
const jwt = require('jsonwebtoken');

const response = require('../libs/response-template');
const utils = require('../libs/utils');
const logger = require('../libs/logger');
const appConfig = require('../config/app-config');

const Customer = require('../models/Customer');

module.exports = {

  login: (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      Customer.findOne({
        username: username
      })
      .then(customer => {
        if (customer === null) {
          res.json(response.error('Customer Not Found!', 404));
        } else {
          customer.verifyPassword(password)
            .then(same => {
              if (!same) {
                res.json(response.error('Invalid password!', 422));
              } else {
                const token = jwt.sign({
                    customerId: customer.customerId,
                    userType: 'customer'
                  },
                  appConfig.secret, {
                    expiresIn: 86400
                  }
                );
                res.cookie('token', token)
                  .json(response.generate(false, 'Login Successful.', 200, { token }));
              }
            })
            .catch(err => {
              res.json(response.error(err));
            });
        }
      })
      .catch(err => {
        res.json(response.error(err));
      });
    } else {
      res.json(response.error('All the required fields should be filled.', 400));
    }
  },

  signup: (req, res) => {
    if (req.body.name && req.body.email && req.body.password && req.body.username) {
      let customer = new Customer({
        customerId: shortid.generate(),
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        address: utils.getNewValue('', req.body.address),
        contact: utils.getNewValue(0, req.body.contact)
      });

      customer.save()
        .then(result => {
          const token = jwt.sign(
            // payload
            {
              customerId: result.customerId,
              userType: 'customer'
            },
            // secretkey
            appConfig.secret,
            // expirationTime
            {
              expiresIn: 86400
            }
          );
          res.cookie('token', token)
            .json(response.generate(false, 'Registration Successful!', 200, { token }));
        })
        .catch(err => {
          res.json(response.error(err));
        });
    } else {
      res.json(response.error('All the required fields should be filled.', 400));
    }
  },

  logout: (req, res) => {
    res.clearCookie('token')
      .json(response.generate(false, 'Logout Successful', 200, null));
  },

  getCustomer: (req, res) => {
    res.json(response.generate(false, 'Customer Details', 200, req.customer));
  },

  getCustomerById: (req, res) => {
    const id = req.params.id;
    Customer.findOne({
      customerId: id
    })
    .then(result => {
      if (result === null) {
        res.json(response.error('Customer Not Found.', 404));
      } else {
        res.json(response.generate(false, 'Customer Found.', 200, {
          name: result.name,
          orders: result.orders
        }));
      }
    })
    .catch(err => {
      res.json(response.error(err));
    });
  },

  deleteCustomer: (req, res) => {
    const id = req.customer.customerId;
    if (id) {
      Customer.findOne({
        customerId: id
      })
      .then(customer => {
        customer.remove()
          .then(result => {
            res.clearCookie('token')
              .json(response.generate(false, 'Customer Deleted Successfully.', 200, null));
          })
          .catch(err => {
            res.json(response.error(err));
          });
      })
      .catch(err => {
        res.json(response.error(err));
      });
    } else {
      res.json(response.error('You are not authorized to delete this customer account.', 401));
    }
  }

};