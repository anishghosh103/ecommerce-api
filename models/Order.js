const mongoose = require('mongoose');

const Product = require('./Product');

let OrderSchema = new mongoose.Schema({

  orderId: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  products: [{
    productId: String,
    quantity: Number
  }],
  createdAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['initiated', 'shipping', 'complete', 'cancelled']
  },
  statusUpdatedAt: {
    type: Date
  }

});

module.exports = mongoose.model('Order', OrderSchema);