const express = require('express');

const router = express.Router();
const controller = require('../controllers/cart');

/**
 * @api {get} /api/v1/cart Get Items from Customer's Cart
 * @apiVersion 0.0.1
 * @apiGroup Cart
 * @apiName GetCartItems
 * @apiPermission Customer
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Items Found."
 *    status: 200,
 *    data: [{..},{..},...,{..}]
 * }
 * @apiSuccessExample {json} Success Response (204):
 * {
 *    error: false,
 *    message: "No item in cart."
 *    status: 204,
 *    data: []
 * }
 * 
 * @apiUse ServerError
 */
router.get('/', controller.getAllCartItems);

/**
 * @api {post} /api/v1/cart Add Items to Cart
 * @apiVersion 0.0.1
 * @apiGroup Cart
 * @apiName AddItemsToCart
 * @apiPermission Customer
 * 
 * @apiParam {String[]} productIds An array of string, where each string denotes a Product ID. (Body Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Items added to cart."
 *    status: 200,
 *    data: null
 * }
 * 
 * @apiErrorExample Error Response (400):
 * {
 *    error: true,
 *    message: "Invalid Product Id."
 *    status: 400,
 *    data: null
 * }
 * @apiUse ServerError
 */
router.post('/', controller.addItemsToCart);

/**
 * @api {put} /api/v1/cart/:productId/update-quantity/:quantity Update quantity of a Product in Cart
 * @apiVersion 0.0.1
 * @apiGroup Cart
 * @apiName UpdateQuantityInCart
 * @apiPermission Customer
 * 
 * @apiParam {String} productId ID of the Product. (URL Parameter)
 * @apiParam {Number} quantity Updated quantity of the Product. (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Item updated in cart successfully."
 *    status: 200,
 *    data: null
 * }
 * 
 * @apiErrorExample Error Response (404):
 * {
 *    error: true,
 *    message: "Item not found in cart.",
 *    status: 404,
 *    data: null
 * }
 * @apiUse ServerError
 */
router.put('/:productId/update-quantity/:quantity', controller.updateQuantity);

/**
 * @api {delete} /api/v1/cart Delete Products from cart
 * @apiVersion 0.0.1
 * @apiGroup Cart
 * @apiName DeleteProductFromCart
 * @apiPermission Customer
 * 
 * @apiParam {String[]} productIds An array of string, where each string denotes a Product ID. (Body Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Item deleted from cart successfully."
 *    status: 200,
 *    data: null
 * }
 * 
 * @apiErrorExample Error Response (400):
 * {
 *    error: true,
 *    message: "Not Product IDs provided to delete."
 *    status: 400,
 *    data: null
 * }
 * @apiErrorExample Error Response (404):
 * {
 *    error: true,
 *    message: "Item not found in cart.",
 *    status: 404,
 *    data: null
 * }
 * @apiUse ServerError
 */
router.delete('/', controller.deleteItemsFromCart);

module.exports = router;