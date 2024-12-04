const express = require('express');

productController = require('./controllers/productController');
shopController = require('./controllers/shopController');

const router = express.Router();

//Product routes
router.get('/products/:id', productController.getProductById);
router.get('/products', shopController.getAllProducts);


module.exports = router;