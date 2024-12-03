const productsService = require('../services/productService');


async function getProductById(req, res) {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
        return res.status(400).json({ success: false, error: 'Invalid product ID' }); // 400 Bad Request
    }

    try {
        const product = await productsService.getProductById(productId);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' }); // 404 Not Found
        }

        res.json({ success: true, product }); // 200 OK
    } catch (error) {
        console.error('Error getting product by id:', error);
        res.status(500).json({ success: false, error: error.message }); // 500 Internal Server Error
    }
}


module.exports = { getProductById };