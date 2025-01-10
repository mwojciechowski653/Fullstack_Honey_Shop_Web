const pool = require('../db');
 
/**
* Fetch customers with filters and total count.
*/
exports.getCustomersByFilters = async (req, res) => {
    const { month, date, name } = req.query;
 
    try {
        // Base query for fetching customers
        let query = `
            SELECT 
                u.id, 
                u.first_name, 
                u.last_name, 
                u.email, 
                u.created_at, 
                ua.country, 
                ua.city, 
                ua.street, 
                ua.street_number, 
                ua.postal_code
            FROM "USER" u
            LEFT JOIN "USER_ADDRESS" ua ON u.id = ua.user_id
            WHERE 1=1
        `;
        const params = [];
 
        // Filter by month
        if (month) {
            query += ` AND EXTRACT(MONTH FROM u.created_at) = $${params.length + 1}`;
            params.push(month);
        }
 
        // Filter by date
        if (date) {
            query += ` AND DATE(u.created_at) = $${params.length + 1}`;
            params.push(date);
        }
 
        // Filter by name (first name or last name)
        if (name) {
            query += ` AND (u.first_name ILIKE $${params.length + 1} OR u.last_name ILIKE $${params.length + 1})`;
            params.push(`%${name}%`);
        }
 
        // Query for total customers
        const totalQuery = 'SELECT COUNT(*) AS total FROM "USER"';
        const totalResult = await pool.query(totalQuery);
 
        // Fetch filtered customers
        const { rows: customers } = await pool.query(query, params);
 
        // Return both total and filtered customers
        res.status(200).json({
            total: totalResult.rows[0].total,
            customers,
        });
    } catch (error) {
        console.error('Error fetching customers with filters:', error.message);
        res.status(500).json({ error: 'Failed to fetch customers with filters', details: error.message });
    }
};