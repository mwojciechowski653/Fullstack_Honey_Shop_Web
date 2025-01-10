const pool = require('../db');

async function getCartSummary(cart) {
    if(cart.length === 0) {
        return [];
    }
    const sizeOptionIds = cart.map(item => item.sizeOptionId);

    const query = `
        SELECT
        p.id AS product_id, p.name, p.image_url, so.id AS size_option_id, so.size, so.regular_price, so.discounted_price, so.is_discounted, so.stock
        FROM "PRODUCT" p
        JOIN "SIZE_OPTION" so ON p.id = so.product_id
        WHERE so.id = ANY($1)`;
    
    try {
        const {rows} = await pool.query(query, [sizeOptionIds]);
        return rows;
    } catch (error) {
        console.error('Error during getting cart summary:', error.message);
        throw new Error('Database query failed');
    }
}

module.exports = { getCartSummary };