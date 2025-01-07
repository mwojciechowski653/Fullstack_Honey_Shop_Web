const express = require('express');

productController = require('./controllers/productController');
shopController = require('./controllers/shopController');
orderController = require('./controllers/orderController');
homePageController = require('./controllers/homePageController');
userController = require('./controllers/userController');
orderController = require('./controllers/orderController');

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
router.get('/home', homePageController.getHomePageProducts);
 router.get('/orders/:id', orderController.getOrderById);

router.put('/users/:id', userController.updateUserById);
router.post('/users/:id', userController.updateUserById);

module.exports = router;