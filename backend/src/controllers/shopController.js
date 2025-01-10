const shopService = require('../services/shopService')                      // getting shopService

async function getAllProducts(req, res) {
    try {
        const products = await shopService.getAllProducts();

        if (!products) {
            return res.status(404).json({ success: false, error: 'Product not found' });            // Error 404 Products table Not Found
        }

        res.json({ success: true, products });                                                      // returning answer as json with table
    } catch (error) {
        console.error('Error during getting products: ', error);
        res.status(500).json({ success: false, error: error.message });             // 500 Internal Server Error
    }
}

module.exports = { getAllProducts };