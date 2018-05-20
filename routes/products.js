const express = require('express');

const router = express.Router();
const controller = require('../controllers/products');

const auth = require('../middlewares/auth');

/**
 * @api {get} /api/v1/products/ Get All Products
 * @apiVersion 0.0.1
 * @apiGroup Products
 * @apiName GetAllProducts
 * @apiPermission none
 * 
 * @apiParam {String} [type='all'] Filter products by category like 'book', 'laptop', etc. (Query Parameter)
 * @apiParam {String} [search=''] Search for products containing the term. (Query Parameter)
 * @apiParam {Number} [minPrice=0] Filter by Minimum Price. Products having price greater than 'minPrice' will be displayed. (Query Parameter)
 * @apiParam {Number} [maxPrice=Infinity] Filter by Minimum Price. Products having price lesser than 'maxPrice' will be displayed. (Query Parameter)
 * @apiParam {Number} [maxPrice=Infinity] Filter by Minimum Price. Products having price lesser than 'maxPrice' will be displayed. (Query Parameter)
 * @apiParam {Number} [skip=0] Skip the number of elements in the product list. (Query Parameter)
 * @apiParam {Number} [limit=10] Show only the number of elements provided in the 'limit'. (Query Parameter)
 * @apiParam {Boolean} [availability] 'Availability' denotes whether to show products in stock or not. (Query Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Products Found."
 *    status: 200,
 *    data: [{..},{..},...,{..}]
 * }
 * @apiSuccessExample {json} Success Response (204):
 * {
 *    error: false,
 *    message: "No products Found."
 *    status: 204,
 *    data: []
 * }
 * 
 * @apiUse ServerError
 */
router.get('/', controller.getAllProducts);

/**
 * @api {get} /api/v1/products/:id Get A Single Product By Id
 * @apiVersion 0.0.1
 * @apiGroup Products
 * @apiName GetProductById
 * @apiPermission none
 * 
 * @apiParam {String} id Product ID. (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Product details found."
 *    status: 200,
 *    data: {..}
 * }
 * 
 * @apiUse ProductNotFoundError
 * @apiUse ServerError
 */
router.get('/:id', controller.getProductById);

/**
 * @api {post} /api/v1/products/ Create A Product
 * @apiVersion 0.0.1
 * @apiGroup Products
 * @apiName CreateProduct
 * @apiPermission Admin
 * 
 * @apiParam {String} name Product Name. (Body Parameter)
 * @apiParam {String} [description] Product Description. (Body Parameters)
 * @apiParam {String} type Product Category. (Body Parameter)
 * @apiParam {Number} price Product Price. (Body Parameter)
 * @apiParam {Number} [stock=1] Quantity of the product available in stock. (Body Parameter)
 * 
 * @apiParam (Book) {String} author Author of the book. (Body Parameter)
 * @apiParam (Book) {String} [publisher] Publisher of the book. (Body Parameter)
 * @apiParam (Book) {Number} [pages] Number of Pages in the book. (Body Parameter)
 * @apiParam (Book) {String} [language] Language the book is written in. (Body Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Product added successfully."
 *    status: 200,
 *    data: null
 * }
 * 
 * @apiUse ValidationError
 * @apiUse ServerError
 */
router.post('/', auth.adminAuthenticated, controller.addProduct);

/**
 * @api {post} /api/v1/products/:id/add-to-cart Add Product To Cart
 * @apiVersion 0.0.1
 * @apiGroup Products
 * @apiName AddProductToCart
 * @apiPermission Customer
 * 
 * @apiParam {String} id Product ID. (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Item is added to cart."
 *    status: 200,
 *    data: null
 * }
 * 
 * @apiUse ServerError
 */
router.post('/:id/add-to-cart', auth.customerAuthenticated, controller.addToCart);

/**
 * @api {put} /api/v1/products/:id Update Product Details
 * @apiVersion 0.0.1
 * @apiGroup Products
 * @apiName UpdateProduct
 * @apiPermission Admin
 * 
 * @apiParam {String} id Product ID. (URL Parameter)
 * @apiParam {String} [description] Product Description. (Body Parameter)
 * @apiParam {Number} [price] Product Price. (Body Parameter)
 * @apiParam {Number} [stock] Quantity of the product available in stock. (Body Parameter)
 * 
 * @apiParam (Book) {String} [author] Author of the book. (Body Parameter)
 * @apiParam (Book) {String} [publisher] Publisher of the book. (Body Parameter)
 * @apiParam (Book) {Number} [pages] Number of Pages in the book. (Body Parameter)
 * @apiParam (Book) {String} [language] Language the book is written in. (Body Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Product updated successfully."
 *    status: 200,
 *    data: null
 * }
 * 
 * @apiUse ProductNotFoundError
 * @apiUse ValidationError
 * @apiUse ServerError
 */
router.put('/:id', auth.adminAuthenticated, controller.updateProduct);

/**
 * @api {delete} /api/v1/products/:id Delete Product
 * @apiVersion 0.0.1
 * @apiGroup Products
 * @apiName DeleteProduct
 * @apiPermission Admin
 * 
 * @apiParam {String} id Product ID. (URL Parameter)
 * 
 * @apiSuccessExample {json} Success Response (200):
 * {
 *    error: false,
 *    message: "Product deleted successfully."
 *    status: 200,
 *    data: null
 * }
 * 
 * @apiUse ProductNotFoundError
 * @apiUse ServerError
 */
router.delete('/:id', auth.adminAuthenticated, controller.deleteProduct);

module.exports = router;