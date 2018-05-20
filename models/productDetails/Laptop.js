const mongoose = require('mongoose');

let LaptopSchema = new mongoose.Schema({

  productId: {
    type: String,
    required: true
  },
  brand: String,
  model: String,
  ram: {
    value: Number,
    unit: String
  },
  processor: {
    brand: String,
    model: String,
    speed: {
      value: Number,
      unit: String
    }
  },
  hdd: {
    value: Number,
    unit: String
  },
  gpu: {
    brand: String,
    model: String,
    size: {
      value: Number,
      unit: String
    }
  },
  screenSize: {
    value: Number,
    unit: String
  },
  os: String,
  weight: {
    value: Number,
    unit: String
  },
  color: String

});

LaptopSchema.statics.get = function (productId, filters) {
  return new Promise((resolve, reject) => {
    this.findOne({ productId })
      .lean()
      .then(details => {
        if (details === null) {
          resolve(null);
          return;
        }

        for (const key in [ 'brand', 'os', 'color' ]) {
          if (filters[key] && (!details[key] || details[key] !== filters[key])) {
            resolve(null);
            return;
          }
        }
        for (const key in [ 'ram', 'hdd', 'screenSize', 'weight' ]) {
          if (filters[key]) {
            const value = filters[key].slice(0, -2);
            const unit = filters[key].substr(-2);
            if (!details[key] || details[key].value !== value || details[key].unit !== unit) {
              resolve(null);
              return;
            }
          }
        }
        if (filters.gpuBrand && (!details.gpu || details.gpu.brand !== filters.gpuBrand)) {
          resolve(null);
          return;
        }
        if (filters.gpuSize) {
          const value = filters.gpuSize.slice(0, -2);
          const unit = filters.gpuSize.substr(-2);
          if (!details.gpu || details.gpu.size.value !== value || details.gpu.size.unit !== unit) {
            resolve(null);
            return;
          }
        }
        if (filters.processorBrand) {
          if (!details.processor || details.processor.brand !== filters.processorBrand) {
            resolve(null);
            return;
          }
        }
        if (filters.processorSpeed) {
          const value = filters.gpuSize.slice(0, -3);
          const unit = filters.gpuSize.substr(-3);
          const processor = details.processor;
          if (!processor || processor.size.value !== value || processor.size.unit !== unit) {
            resolve(null);
            return;
          }
        }
        resolve(details);
      })
      .catch(err => reject(err));
  });
};

module.exports = mongoose.model('Laptop', LaptopSchema);