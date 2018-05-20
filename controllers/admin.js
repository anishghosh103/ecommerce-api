const jwt = require('jsonwebtoken');

const appConfig = require('../config/app-config');
const response = require('../libs/response-template');

const Admin = require('../models/Admin');

module.exports = {

  getAdmin: (req, res) => {
    res.json(response.generate(false, 'Admin Data.', 200, req.admin));
  },

  getAdminById: (req, res) => {
    const id = req.params.id;

    Admin.findOne({ adminId: id })
      .then(admin => {
        if (admin === null) {
          res.json(response.error('Admin Not Found.', 404));
        } else if (admin.rank < req.admin.rank) {
            res.json(response.error('You are not eligible to view details of this Admin', 403));
        } else {
          res.json(response.generate(false, 'Admin Details.', 200, admin));
        }
      })
      .catch(err => {
        res.json(response.error(err));
      });
  },

  logout: (req, res) => {
    res.clearCookie('token')
      .json(response.generate(false, 'Logout Successful.', 200, null));
  },

  login: (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

      Admin.findOne({ username })
        .then(admin => {
          if (admin === null) {
            res.json(response.error('Admin Not Found.', 404));
          } else {
            admin.checkPassword(password)
              .then(same => {
                if (!same) {
                  res.json(response.error('Invalid Password.', 422));
                } else {
                  const token = jwt.sign(
                    { adminId: admin.adminId, userType: 'admin' },
                    appConfig.secret,
                    { expiresIn: 86400 }
                  );
                  res.cookie('token', token)
                    .json(response.generate(false, 'Login Successful.', 200, { token }));
                }
              })
              .catch(err => {
                res.json(response.error(err));
              });
          }
        })
        .catch(err => {
          res.json(response.error(err));
        });

    } else {
      res.json(response.error('Some login credentials are missing.', 400));
    }
  },

  createAdmin: (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const rank = req.admin.rank + 1;

    if (username && password) {
      let admin = new Admin({
        username,
        password,
        rank
      });

      admin.save()
        .then(result => {
          res.json(response.generate(false, 'Admin created successfully.', 200, result));
        })
        .catch(err => {
          res.json(response.error(err));
        });
    } else {
      res.json(response.error('Some credentials are missing.', 400));
    }
  },

  deleteAdmin: (req, res) => {
    const id = req.params.id;

    Admin.findOne({ adminId: id })
      .then(admin => {
        if (admin === null) {
          res.json(response.error('Admin Not Found.', 404));
        } else if (admin.rank < req.admin.rank) {
          res.json(response.error('You are not eligible to delete this Admin.', 403));
        } else {
          admin.remove()
            .then(() => {
              if (req.admin.rank === admin.rank) {
                res.clearCookie('token');
              }
              res.json(response.generate(false, 'Admin deleted successfully.', 200, null));
            })
            .catch(err => {
              res.json(response.error(err));
            });
        }
      })
      .catch(err => {
        res.json(response.error(err));
      });
  }

};