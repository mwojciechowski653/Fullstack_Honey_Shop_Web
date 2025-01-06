const pool = require('../db');

async function getUserById(id) {
    const query = `
            SELECT 
                u.id, u.first_name, u.last_name, u.email,
                ua.country,
                ua.city, ua.street, ua.street_number, ua.postal_code, u.phone
            FROM "USER" u 
            LEFT JOIN "USER_ADDRESS" ua 
            ON u.id = ua.user_id
            WHERE u.id = $1`;
    
    try {
        const {rows} = await pool.query(query, [id]);
        if (rows.length === 0)
            return null;
        const user = {
            id: rows[0].id,
            first_name: rows[0].first_name,
            last_name: rows[0].last_name,
            email: rows[0].email,
            user_phone: rows[0].phone,
            country: rows[0].country,
            city: rows[0].city,
            street: rows[0].street,
            street_number: rows[0].street_number,
            postal_code: rows[0].postal_code
            };
        return user;
        } catch (error) {
            console.error('Error getting user by id:', error);
            throw new Error('Database query failed');
        }
}




module.exports = {getUserById};