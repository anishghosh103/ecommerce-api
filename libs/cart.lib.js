const Customer = require('../models/Customer');

module.exports = {

  addToCart: (customer, productId, callback) => {
    return new Promise((resolve, reject) => {
      let index = -1;

      const item = customer.cart.find((item, i) => {
        if (item.productId === productId) {
          index = i;
          return true;
        }
      });

      if (item) {
        customer.cart[index].quantity += 1;
      } else {
        customer.cart.push({
          quantity: 1,
          productId
        });
      }

      customer.save()
        .then(result => resolve())
        .catch(err => reject(err));
    });
  }

};