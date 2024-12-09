const pool = require('../db');

/**
 * Fetch customers by filters (country, city, first_name, year)
 * @param {string} country - Filter: country
 * @param {string} city - Filter: city
 * @param {string} first_name - Filter: first name
 * @param {string} year - Filter: year (from created_at)
 * @returns {Array} - List of customers matching the filters
 */
async function getCustomersByFilters(country, city, first_name, year) {
    const query = `
        SELECT 
            u.id, u.email, u.first_name, u.last_name, u.is_admin, u.created_at, u.phone,
            ua.id AS address_id, ua.country, ua.city, ua.street, ua.street_number, ua.postal_code
        FROM "USER" u
        LEFT JOIN "USER_ADDRESS" ua
        ON u.id = ua.user_id
        WHERE 1=1
        ${country ? `AND ua.country = $${1}` : ''}
        ${city ? `AND ua.city = $${country ? 2 : 1}` : ''}
        ${first_name ? `AND u.first_name = $${country && city ? 3 : country || city ? 2 : 1}` : ''}
        ${year ? `AND EXTRACT(YEAR FROM u.created_at) = $${country && city && first_name ? 4 : (country && city) || (country && first_name) || (city && first_name) ? 3 : 2}` : ''}`;

    const params = [];
    if (country) params.push(country);
    if (city) params.push(city);
    if (first_name) params.push(first_name);
    if (year) params.push(year);

    try {
        const { rows } = await pool.query(query, params);

        // Map results to a readable structure
        const customers = rows.map(row => ({
            id: row.id,
            email: row.email,
            first_name: row.first_name,
            last_name: row.last_name,
            is_admin: row.is_admin,
            created_at: row.created_at,
            phone: row.phone,
            address: {
                id: row.address_id,
                country: row.country,
                city: row.city,
                street: row.street,
                street_number: row.street_number,
                postal_code: row.postal_code
            }
        }));

        return customers;
    } catch (error) {
        console.error('Error fetching customers with filters:', error);
        throw new Error('Database query failed');
    }
}

/**
 * Fetch all customers from the database
 * @returns {Array} - List of all customers
 */
async function getAllCustomers() {
    const query = `
        SELECT 
            u.id, u.email, u.first_name, u.last_name, u.is_admin, u.created_at, u.phone,
            ua.id AS address_id, ua.country, ua.city, ua.street, ua.street_number, ua.postal_code
        FROM "USER" u
        LEFT JOIN "USER_ADDRESS" ua
        ON u.id = ua.user_id`;

    try {
        const { rows } = await pool.query(query);

        // Map results to a readable structure
        const customers = rows.map(row => ({
            id: row.id,
            email: row.email,
            first_name: row.first_name,
            last_name: row.last_name,
            is_admin: row.is_admin,
            created_at: row.created_at,
            phone: row.phone,
            address: {
                id: row.address_id,
                country: row.country,
                city: row.city,
                street: row.street,
                street_number: row.street_number,
                postal_code: row.postal_code
            }
        }));

        return customers;
    } catch (error) {
        console.error('Error fetching all customers:', error);
        throw new Error('Database query failed');
    }
}

module.exports = {
    getCustomersByFilters,
    getAllCustomers,
};
