const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const logger = require('../libs/logger');

const Order = require('./Order');
const Product = require('./Product');

let CustomerSchema = new mongoose.Schema({

  customerId: {
    type: String,
    index: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  contact: {
    type: Number
  },
  orders: [String],
  cart: [{
    quantity: Number,
    productId: String
  }]

});

CustomerSchema.pre('save', function (next) {
  const customer = this;
  bcrypt.hash(customer.password, 10)
    .then(hash => {
      customer.password = hash;
      next();
    })
    .catch(err => {
      next(new Error('Error occurred while encrypting the password.'));
    });
});

CustomerSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Customer', CustomerSchema);