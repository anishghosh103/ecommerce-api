const shortid = require('shortid');
const moment = require('moment');

const response = require('../libs/response-template');

const Customer = require('../models/Customer');
const Order = require('../models/Order');

module.exports = {

  getAllOrders: (req, res) => {
    let orders = [];

    if (req.customer.orders.length === 0) {
      res.json(response.generate(false, 'No orders found.', 204, orders));
    }

    req.customer.orders.forEach(orderId => {
      Order.findOne({ orderId })
        .then(order => {
          orders.push(order);
          if (orders.length === req.customer.orders.length) {
            res.json(response.generate(false, 'Orders Found.', 200, orders));
          }
        })
        .catch(err => {
          res.json(response.error(err));
        });
    });
  },

  getOrderById: (req, res) => {
    const orderId = req.params.id;
    
    if (~req.customer.orders.indexOf(orderId)) {
      res.json(response.error('Order Not Found', 404));
    }

    Order.findOne({ orderId })
      .then(order => {
        if (order === null) {
          res.json(response.error('Order Not Found', 404));
        } else {
          res.json(response.generate(false, 'Order details found.', 200, order));
        }
      })
      .catch(err => {
        res.json(response.error(err));
      });
  },

  createOrder: (req, res) => {
    if (req.body.productIds) {
      let order = new Order({
        orderId: shortid.generate(),
        products: req.body.products,
        createdAt: moment(),
        status: 'initiated',
        statusUpdatedAt: moment() 
      });

      order.save()
        .then(result => {
          const orderId = result.orderId;
          req.customer.orders.push(orderId);
          req.customer.save()
            .then(result => {
              res.json(response.generate(false, 'Order successfully placed.', 200, { orderId }));
            })
            .catch(err => {
              order.remove();
              res.json(response.error(err));
            });
        })
        .catch(err => {
          res.json(response.error(err));
        });
    } else {
      res.json(response.error({ name: 'ValidationError' }));
    }
  },

  deleteOrder: (req, res) => {
    if (req.customer.orders.includes(req.params.id)) {
      const orderId = req.params.id;
      Order.deleteOne({ orderId })
        .then(() => {
          req.customer.orders.splice(req.customer.orders.indexOf(orderId), 1);
          req.customer.save()
            .then(result => {
              res.json(response.generate(false, 'Order deleted successfully.', 200, null));
            })
            .catch(err => {
              res.json(response.error(err));
            });
        })
        .catch(err => {
          res.json(response.error(err));
        });
    } else {
      res.json(response.error('Order Not Found.', 404));
    }
  }

};