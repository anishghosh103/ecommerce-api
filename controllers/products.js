const mongoose = require('mongoose');
const shortid = require('shortid');

const logger = require('../libs/logger');
const response = require('../libs/response-template');
const cartLib = require('../libs/cart.lib');

const Product = require('../models/Product');

module.exports = {

  getAllProducts: (req, res) => {
    Product.getAll(req.query)
      .then(products => {
        if (products === null) {
          res.json(response.generate(false, 'No products found.', 204, []));
        } else {
          res.json(response.generate(false, 'Products Found.', 200, products));
        }
      })
      .catch(err => {
        res.json(response.error(err));
      });
  },

  getProductById: (req, res) => {
    const id = req.params.id;
    
    Product
      .getDetails(id)
      .then(result => {
        res.json(response.generate(false, 'Product details found.', 200, result));
      })
      .catch(err => {
        res.json(response.error(err));
      });
  },

  addProduct: (req, res) => {
    req.body.productId = shortid.generate();

    Product
      .createProduct(req.body)
      .then(product => {
        res.json(response.generate(false, 'Product added successfully.', 200, null));
      })
      .catch(err => {
        res.json(response.error(err));
      });
  },

  updateProduct: (req, res) => {
    const id = req.params.id;

    Product
      .updateProduct(id, req.body)
      .then(result => {
        res.json(response.generate(false, 'Product updated successfully.', 200, null));
      })
      .catch(err => {
        res.json(response.error(err));
      });
  },

  deleteProduct: (req, res) => {
    const id = req.params.id;

    Product
      .deleteProduct(id)
      .then(() => {
        res.json(response.generate(false, 'Product deleted successfully.', 200, null));
      })
      .catch(err => {
        res.json(response.error(err));
      });
  },

  addToCart: (req, res) => {
    cartLib.addToCart(req.customer, req.params.id)
      .then(() => {
        res.json(response.generate(false, 'Item is added to cart.', 200, null));
      })
      .catch(err => {
        res.json(response.error(err));
      });
  }

};