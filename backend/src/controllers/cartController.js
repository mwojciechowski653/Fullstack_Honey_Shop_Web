const cartService = require('../services/cartService');
const { body, validationResult } = require('express-validator');

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


const placeOrderValidators = [
    body('cart').isArray().withMessage('Cart should be an array'),
    body('cart').custom(value => value.length > 0).withMessage('Cart is empty'),
    body('deliveryOptionId').isNumeric().withMessage('Delivery option ID is required'),
    body('deliveryOptionId').custom(value => [1, 2, 3].includes(value)).withMessage('Invalid delivery option ID')
];

async function placeOrder(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    try {
        // check for body
        if (!req.body.cart) {
            throw new Error('Cart is required');
        }
        // verify if cart is an array
        if (!Array.isArray(req.body.cart)) {
            throw new Error('Cart should be an array');
        }
        const serviceRes = await cartService.placeOrder(req.body, userId);
        if (!serviceRes.success) {
            res.status(400).json(serviceRes);
            return;
        }
        res.status(201).json(serviceRes);
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({error: "Internal server error"});
    }
}
module.exports = { getCartSummary, placeOrder, placeOrderValidators }; 