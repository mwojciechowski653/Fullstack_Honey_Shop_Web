const express = require('express');

productController = require('./controllers/productController');
shopController = require('./controllers/shopController');
orderController = require('./controllers/orderController');

const router = express.Router();
const customerController = require('./controllers/customerController');

//Customers routes
router.get('/customers', customerController.getCustomersByFilters);

//Product routes
router.get('/products/:id', productController.getProductById);
router.get('/products', shopController.getAllProducts);
router.get('/orders', orderController.getAllOrders);

//Home page routes
//router.get('/home', productController.getHomePageProducts);
 
module.exports = router;