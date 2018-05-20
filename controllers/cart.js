
const response = require('../libs/response-template');
const cartLib = require('../libs/cart.lib');

const Customer = require('../models/Customer');
const Product = require('../models/Product');

module.exports = {

  getAllCartItems: (req, res) => {
    if (req.customer.cart.length > 0) {

      let items = [];
      let count = req.customer.cart.length;

      req.customer.cart.forEach(item => {

        Product.findOne({ productId: item.productId })
          .then(product => {
            if (product !== null) {
              items.push({ product, quantity: item.quantity });
            }
            if (--count === 0) {
              res.json(response.generate(false, 'Items Found.', 200, items));
            }
          })
          .catch(err => {
            res.json(response.error(err));
          });

      });

    } else {
      res.json(response.generate(false, 'No item in cart.', 204, []));
    }
  },

  addItemsToCart: (req, res) => {
    if (req.body.productIds) {

      let count = productIds.length;

      productIds.forEach(productId => {

        Product.findOne({ productId })
          .then(product => {
            if (product !== null) {
              cartLib.addToCart(req.customer, productId)
                .then(() => {
                  res.json(response.generate(false, 'Items added to cart.', 200, null));
                })
                .catch(err => {
                  res.json(response.error(err));
                });
            }
          })
          .catch(err => {
            res.json(response.error('Invalid Product Id.', 400));
          });

      });

    }
  },

  updateQuantity: (req, res) => {
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    let item = req.customer.cart.find(item => item.productId === productId);

    if (item) {

      item.quantity = quantity;

      req.customer.save()
        .then(customer => {
          res.json(response.generate(false, 'Item updated in cart successfully.', 200, null));
        })
        .catch(err => {
          res.json(response.error(err));
        });

    } else {
      res.json(response.error('Item not found in cart.', 404));
    }
  },

  deleteItemsFromCart: (req, res) => {
    if (req.body.productIds) {

      let count = productIds.length;

      productIds.forEach(productId => {

        let item = req.customer.cart.find(item => item.productId === productId);

        if (!item) {
          res.json(response.error('Item not found in cart.', 404));
        } else {
          req.customer.cart.splice(req.customer.cart.indexOf(item), 1);
          if (--count === 0) {
            req.customer.save()
              .then(customer => {
                res.json(response.generate(false, 'Item deleted from cart successfully.', 200, null));
              })
              .catch(err => {
                res.json(response.error(err));
              });
          }
        }

      });

    } else {
      res.json(response.error('No Product IDs provided to delete.', 400));
    }
  }

};