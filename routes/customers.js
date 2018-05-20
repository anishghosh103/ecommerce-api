const express = require('express');

const router = express.Router();
const controller = require('../controllers/customers');

const authMiddleware = require('../middlewares/auth');

/**
 * @api {get} /api/v1/customers/me Get Details of the Logged In Customer
 * @apiVersion 0.0.1
 * @apiGroup Customers
 * @apiName GetCustomerDetails
 * @apiPermission Customer
 * 
 * @apiParam {String} id Product ID. (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Customer Details."
 *    status: 200,
 *    data: {..}
 * }
 */
router.get('/me', authMiddleware.customerAuthenticated, controller.getCustomer);

/**
 * @api {get} /api/v1/customers/logout Customer Logout
 * @apiVersion 0.0.1
 * @apiGroup Customers
 * @apiName CustomerLogout
 * @apiPermission Customer
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Logout Successful."
 *    status: 200,
 *    data: null
 * }
 */
router.get('/logout', authMiddleware.customerAuthenticated, controller.logout);

/**
 * @api {get} /api/v1/customers/:id Get Details of a Customer by ID
 * @apiVersion 0.0.1
 * @apiGroup Customers
 * @apiName GetCustomerById
 * 
 * @apiParam {String} id Customer ID. (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Customer Found."
 *    status: 200,
 *    data: {
 *      name: "string"
 *      orders: string[]
 *    }
 * }
 * 
 * @apiUse CustomerNotFoundError
 * @apiUse ServerError
 */
router.get('/:id', controller.getCustomerById);

/**
 * @api {post} /api/v1/customers/login Customer Login
 * @apiVersion 0.0.1
 * @apiGroup Customers
 * @apiName CustomerLogin
 * 
 * @apiParam {String} username Customer's username. (Body Parameter)
 * @apiParam {String} password Customer's password. (Body Parameter)
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
 * @apiUse CustomerNotFoundError
 * @apiErrorExample Error Response (422):
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
 * @api {post} /api/v1/customers/signup Customer Sign Up
 * @apiVersion 0.0.1
 * @apiGroup Customers
 * @apiName CustomerSignup
 * 
 * @apiParam {String} name Customer's name. (Body Parameter)
 * @apiParam {String} email Customer's email address. (Body Parameter)
 * @apiParam {String} username Customer's username. (Body Parameter)
 * @apiParam {String} password Customer's password. (Body Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Registration Successful."
 *    status: 200,
 *    data: {
 *      token: "jsonwebtoken"
 *    }
 * }
 * 
 * @apiUse ValidationError
 * @apiUse ServerError
 */
router.post('/signup', controller.signup);

/**
 * @api {delete} /api/v1/customers/ Delete Customer Account
 * @apiVersion 0.0.1
 * @apiGroup Customers
 * @apiName DeleteCustomer
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Customer Deleted Successfully."
 *    status: 200,
 *    data: null
 * }
 * 
 * @apiUse ServerError
 */
router.delete('/', authMiddleware.customerAuthenticated, controller.deleteCustomer);

module.exports = router;