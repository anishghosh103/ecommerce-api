const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');

let AdminSchema = new mongoose.Schema({

  adminId: {
    type: String,
    index: true,
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
  // lower rank holds the higher privilege
  rank: {
    type: Number,
    require: true
  }

});

AdminSchema.pre('save', function (next) {
  const admin = this;
  admin.adminId = shortid.generate();
  bcrypt.hash(admin.password, 10)
    .then(hash => {
      admin.password = hash;
      next();
    })
    .catch(err => next(err));
});

AdminSchema.methods.checkPassword = function (password, callback) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);