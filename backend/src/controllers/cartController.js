const cartService = require('../services/cartService');

async function getCartSummary(req, res) {
    try {
        // check for body
        if (!req.body.cart) {
            throw new Error('Cart is required');
        }
        // verify if cart is an array
        if (!Array.isArray(req.body.cart)) {
            throw new Error('Cart should be an array');
        }
        const cartSummary = await cartService.getCartSummary(req.body.cart);
        res.status(200).json(cartSummary);
    } catch (error) {
        console.error('Error getting cart summary:', error.message);
        res.status(500).json({error: error.message});
    }
}


module.exports = { getCartSummary }; 