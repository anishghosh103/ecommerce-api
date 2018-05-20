/**
 * @apiDefine ProductNotFoundError
 * 
 * @apiErrorExample {json} Error Response (404):
 * {
 *    error: true,
 *    message: "Product Not Found.",
 *    status: 404,
 *    data: null
 * }
 */

 /**
 * @apiDefine CustomerNotFoundError
 * 
 * @apiErrorExample {json} Error Response (404):
 * {
 *    error: true,
 *    message: "Customer Not Found.",
 *    status: 404,
 *    data: null
 * }
 */

 /**
 * @apiDefine OrderNotFoundError
 * 
 * @apiErrorExample {json} Error Response (404):
 * {
 *    error: true,
 *    message: "Order Not Found.",
 *    status: 404,
 *    data: null
 * }
 */

 /**
 * @apiDefine AdminNotFoundError
 * 
 * @apiErrorExample {json} Error Response (404):
 * {
 *    error: true,
 *    message: "Admin Not Found.",
 *    status: 404,
 *    data: null
 * }
 */

/**
 * @apiDefine ValidationError
 * 
 * @apiErrorExample {json} Error Response (422):
 * {
 *    error: true,
 *    message: "Data Validation Failed. Please Check The Data.",
 *    status: 422,
 *    data: null
 * }
 */

/**
 * @apiDefine ServerError
 * 
 * @apiErrorExample {json} Error Response (500):
 * {
 *    error: true,
 *    message: "Error occurred.",
 *    status: 500,
 *    data: null
 * }
 */