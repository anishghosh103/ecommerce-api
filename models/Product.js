const mongoose = require('mongoose');

const logger = require('../libs/logger');
const detailsMap = require('./productDetails/map');

let ProductSchema = new mongoose.Schema({

  productId: {
    type: String,
    index: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    lowercase: true,
    required: true,
    enum: ['book', 'laptop']
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 1
  }

});

ProductSchema.statics.getAll = function (filters) {
  const findCriteria = {};
  if (filters.type && filter.type !== 'all') findCriteria.type = filter.type;
  if (filters.search) findCriteria.name = {
    "$regex": filter.search,
    "$options": "i"
  };

  filters.minPrice = filters.minPrice || 0;
  filters.maxPrice = filters.maxPrice || Infinity;
  filters.skip = filters.skip || 0;
  filters.limit = filters.limit || 10;
  filters.sort = filters.sort || 'name';
  filters.minStock = filters.availability ? 1 : 0;

  return new Promise((resolve, reject) => {
    this.find(findCriteria)
      .where('price').gte(filters.minPrice).lte(filters.maxPrice)
      .where('stock').gte(filters.minStock)
      .skip(filters.skip).limit(filters.limit)
      .sort(filters.sort)
      .lean()
      .then(docs => {
        if (!docs || docs.length === 0) {
          resolve(null);
          return;
        }

        let products = [];
        let count = docs.length;

        docs.forEach(product => {
          detailsMap[product.type].get(product.productId, filters)
            .then(details => {
              if (details !== null) {
                for (const key in details) product[key] = details[key];
              }
              products.push(product);
              if (--count === 0) {
                resolve(products);
              }
            });
        });
      })
      .catch(err => reject(err));
  });
};

/**
 * Product.getDetails shall give the details of the product based on type
 * @param {String} productId productId of the Product
 * @param {(err, product) => void} callback Callback function to pass the product details
 */
ProductSchema.statics.getDetails = function (productId) {
  return new Promise((resolve, reject) => {
    this
      .findOne({
        productId
      })
      .lean()
      .then(product => {
        if (!product) {
          reject({
            message: 'Product Not Found.',
            status: 404,
            custom: true
          });
        } else {
          detailsMap[product.type]
            .findOne({
              productId
            })
            .lean()
            .then(details => {
              for (const key in details) product[key] = details[key];
              resolve(product);
            })
            .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  });

};

ProductSchema.statics.createProduct = function (details) {
  return new Promise((resolve, reject) => {
    if (details.productId && details.name && details.type && details.price) {
      this.create(details)
        .then(product => {
          detailsMap[product.type]
            .create(details)
            .then(result => resolve())
            .catch(err => {
              product.remove();
              reject(err);
            });
        })
        .catch(err => reject(err));
    } else {
      console.log(details.name);
      reject({
        message: 'Data Validation Failed. Please Check The Data.',
        status: 422,
        custom: true
      });
    }
  });
};

ProductSchema.statics.updateProduct = function (productId, details) {
  return new Promise((resolve, reject) => {
    if (details.type !== undefined || details.productId !== undefined || details.name !== undefined) {
      reject({
        message: 'ProductId, Type & Name cannot be modified',
        status: 422,
        custom: true
      });
      return;
    }
    this
      .findOneAndUpdate({
        productId
      }, details)
      .then(product => {
        if (product === null) {
          reject({
            message: 'Product Not Found.',
            status: 404,
            custom: true
          });
        } else {
          detailsMap[product.type]
            .findOneAndUpdate({
              productId
            }, details)
            .then(result => resolve())
            .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  });
};

ProductSchema.statics.deleteProduct = function (productId) {
  return new Promise((resolve, reject) => {
    this
      .findOneAndDelete({
        productId
      })
      .then(result => {
        if (result === null) {
          reject({
            message: 'Product Not Found.',
            status: 404,
            custom: true
          });
        } else {
          detailsMap[result.type]
            .findOneAndDelete({
              productId
            })
            .then(result => resolve())
            .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  });
};

module.exports = mongoose.model('Product', ProductSchema);