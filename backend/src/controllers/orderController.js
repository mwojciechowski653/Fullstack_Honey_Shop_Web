const orderService = require('../services/orderService')  // Importing the orderService module to interact with the order data

// Asynchronous function to fetch all orders based on the provided filters
async function getAllOrders(req, res) {
    try {
        const filters = req.query;  // Extracting filters (query parameters) from the request

        // Calling the orderService's getAllOrders function with the filters to fetch orders from the database
        const orders = await orderService.getAllOrders(filters);

        // If no orders are found, returning a JSON response indicating that orders were not found
        if (!orders || orders.length === 0) {
            return res.json({ success: false, error: 'Orders not found' });  // No orders found in the database
        }

        // If orders are found, returning them as a JSON response along with a success flag
        res.json({ success: true, orders });  // Returning orders in JSON format

    } catch (error) {
        // If an error occurs, log the error and send a 500 response with an error message
        console.error('Error during getting products: ', error);
        res.status(500).json({ success: false, error: error.message });  // Error 500: Internal Server Error
    }
}

module.exports = { getAllOrders };  // Exporting the function to be used elsewhere in the application
