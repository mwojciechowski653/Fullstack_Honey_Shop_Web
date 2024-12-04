const express = require('express');

productController = require('./controllers/productController');
shopController = require('./controllers/shopController');
orderController = require('./controllers/orderController');

const router = express.Router();

//Product routes
router.get('/products/:id', productController.getProductById);
router.get('/products', shopController.getAllProducts);
router.get('/orders', orderController.getAllOrders);


module.exports = router;