const express = require('express');
const loginRequired = require('./middleware/authenticate');
const productController = require('./controllers/productController');
const shopController = require('./controllers/shopController');
const orderController = require('./controllers/orderController');
const homePageController = require('./controllers/homePageController');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const cartController = require('./controllers/cartController');

const router = express.Router();
const customerController = require('./controllers/customerController');

//Customers routes
router.get('/customers', customerController.getCustomersByFilters);

//Product routes
router.get('/products/:id', productController.getProductById);
router.get('/products', shopController.getAllProducts);
router.get('/orders', orderController.getAllOrders);
router.get('/users/:id', userController.getUserById);
//Home page routes
router.get('/home', homePageController.getTopSellingProducts);
 
module.exports = router;
