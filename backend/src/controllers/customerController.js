const customerService = require('../services/customerService');

exports.getCustomersByFilters = async (req, res) => {
    const { country, city, first_name, year } = req.query; // Parameters from query in URL
    try {
        // If no filters are provided, return all customers
        if (!country && !city && !first_name && !year) {
            const customers = await customerService.getAllCustomers();
            return res.status(200).json(customers); // List of all customers
        }

        // Otherwise, query the service with the provided filters
        const customers = await customerService.getCustomersByFilters(country, city, first_name, year);
        res.status(200).json(customers); // Return customers matching the filters
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers with the provided filters' });
    }
};