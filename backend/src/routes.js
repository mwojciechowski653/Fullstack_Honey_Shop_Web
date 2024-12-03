const express = require('express');

productController = require('./controllers/productController');

const router = express.Router();

//Product routes
router.get('/products/:id', productController.getProductById);


module.exports = router;