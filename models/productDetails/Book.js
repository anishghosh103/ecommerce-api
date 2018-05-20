const mongoose = require('mongoose');

let BookSchema = new mongoose.Schema({

  productId: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publisher: {
    type: String
  },
  pages: {
    type: Number
  },
  language: {
    type: String
  }

});

BookSchema.statics.get = function (productId, filters) {
  return new Promise((resolve, reject) => {
    this.findOne({ productId })
      .lean()
      .then(details => {
        for (const field of [ 'author', 'language', 'publisher' ]) {
          if (filters[field] && details[field] !== filters[field]) {
            resolve(null);
            return;
          }
        }
        if (filters.minPages && details.pages < filters.minPages) {
          resolve(null);
          return;
        }
        if (filters.maxPages && details.pages > filters.maxPages) {
          resolve(null);
          return;
        }
        resolve(details);
      })
      .catch(err => reject(err));
  });
};

module.exports = mongoose.model('Book', BookSchema);