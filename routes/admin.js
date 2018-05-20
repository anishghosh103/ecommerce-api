const express = require('express');

const router = express.Router();
const controller = require('../controllers/admin');

const auth = require('../middlewares/auth');

/**
 * @api {get} /api/v1/admin Get Admin Details
 * @apiVersion 0.1.0
 * @apiName GetAdminDetails
 * @apiGroup Admin
 * @apiPermission Admin
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Admin Data."
 *    status: 200,
 *    data: {..}
 * }
 * 
 * @apiUse ServerError
 */
router.get('/', auth.adminAuthenticated, controller.getAdmin);

/**
 * @api {get} /api/v1/admin/logout Admin Logout
 * @apiVersion 0.1.0
 * @apiName AdminLogout
 * @apiGroup Admin
 * @apiPermission Admin
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Logout Successful."
 *    status: 200,
 *    data: null
 * }
 */
router.get('/logout', auth.adminAuthenticated, controller.logout);

/**
 * @api {get} /api/v1/admin/:id Get Admin Details By ID
 * @apiVersion 0.1.0
 * @apiName GetAdminDetailsById
 * @apiGroup Admin
 * @apiPermission Admin
 * 
 * @apiParam {String} id Admin ID. (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Admin Details."
 *    status: 200,
 *    data: {..}
 * }
 * 
 * @apiUse AdminNotFoundError
 * @apiErrorExample Error Response (403)
 * {
 *    error: true,
 *    message: "You are not eligible to view details of this Admin",
 *    status: 403,
 *    data: null
 * }
 * @apiUse ServerError
 */
router.get('/:id', auth.adminAuthenticated, controller.getAdminById);

/**
 * @api {post} /api/v1/admin/login Admin Login
 * @apiVersion 0.1.0
 * @apiName AdminLogin
 * @apiGroup Admin
 * 
 * @apiParam {String} username Username of Admin. (Body Parameter)
 * @apiParam {String} password Password of Admin. (Body Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Login Successful."
 *    status: 200,
 *    data: {
 *      token: "jsonwebtoken"
 *    }
 * }
 * 
 * @apiUse AdminNotFoundError
 * @apiErrorExample Error Response (422)
 * {
 *    error: true,
 *    message: "Invalid Password!",
 *    status: 422,
 *    data: null
 * }
 * @apiUse ServerError
 */
router.post('/login', controller.login);

/**
 * @api {post} /api/v1/admin/create-admin Admin Registration
 * @apiVersion 0.1.0
 * @apiName AdminRegistration
 * @apiGroup Admin
 * @apiPermission Admin
 * 
 * @apiParam {String} username Username of Admin. (Body Parameter)
 * @apiParam {String} password Password of Admin. (Body Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Admin created successfully."
 *    status: 200,
 *    data: {..}
 * }
 * 
 * @apiErrorExample Error Response (400)
 * {
 *    error: true,
 *    message: "Some credentials are missing.",
 *    status: 400,
 *    data: null
 * }
 * @apiUse ServerError
 */
router.post('/create-admin', auth.adminAuthenticated, controller.createAdmin);

/**
 * @api {delete} /api/v1/admin/:id Admin Deletion
 * @apiVersion 0.1.0
 * @apiName AdminDeletion
 * @apiGroup Admin
 * @apiPermission Admin
 * 
 * @apiParam {String} id ID of the Admin to be deleted. (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Admin deleted successfully."
 *    status: 200,
 *    data: null
 * }
 * 
 * @apiUse AdminNotFoundError
 * @apiErrorExample Error Response (403)
 * {
 *    error: true,
 *    message: "You are not eligible to delete this Admin.",
 *    status: 403,
 *    data: null
 * }
 * @apiUse ServerError
 */
router.delete('/:id', auth.adminAuthenticated, controller.deleteAdmin);

module.exports = router;