const express = require('express');

const router = express.Router();
const controller = require('../controllers/orders');

/**
 * @api {get} /api/v1/orders/ Get Orders of the Logged In Customer
 * @apiVersion 0.0.1
 * @apiGroup Orders
 * @apiName GetOrders
 * @apiPermission Customer
 * 
 * @apiParam {String} id Product ID. (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Orders Found."
 *    status: 200,
 *    data: [{..},{..},...,{..}]
 * }
 * @apiSuccessExample {json} Success Response (204):
 * {
 *    error: false,
 *    message: "No orders found."
 *    status: 204,
 *    data: []
 * }
 * 
 * @apiUse ServerError
 */
router.get('/', controller.getAllOrders);

/**
 * @api {get} /api/v1/orders/:id Get Order of the logged in Customer by ID
 * @apiVersion 0.0.1
 * @apiGroup Orders
 * @apiName GetOrderById
 * @apiPermission Customer
 * 
 * @apiParam {String} id Product ID. (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Orders details found."
 *    status: 200,
 *    data: {..}
 * }
 * 
 * @apiUse OrderNotFoundError
 * @apiUse ServerError
 */
router.get('/:id', controller.getOrderById);
  
/**
 * @api {post} /api/v1/orders Create New Order
 * @apiVersion 0.0.1
 * @apiGroup Orders
 * @apiName CreateNewOrder
 * @apiPermission Customer
 * 
 * @apiParam {Object[]} products List of objects containing productId and quantity. (Body Parameter)
 * 
 * @apiParamExample Order Request Example:
 * [
 *    { producId: "someid", quantity: 1 },
 *    { productId: "otherid", quantiy: 3 }
 * ]
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Orders successfully placed."
 *    status: 200,
 *    data: {
 *      orderId: "orderid"
 *    }
 * }
 * 
 * @apiUse ValidationError
 * @apiUse ServerError
 */
router.post('/', controller.createOrder);

/**
 * @api {delete} /api/v1/orders/:id Delete Order
 * @apiVersion 0.0.1
 * @apiGroup Orders
 * @apiName DeleteOrder
 * @apiPermission Customer
 * 
 * @apiParam {String} id ID of the order to be deleted (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Orders deleted successfully."
 *    status: 200,
 *    data: null
 * }
 * 
 * @apiUse OrderNotFoundError
 * @apiUse ServerError
 */
router.delete('/:id', controller.deleteOrder);

module.exports = router;