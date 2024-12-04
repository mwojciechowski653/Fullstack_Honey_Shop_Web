const pool = require('../db');

async function getProductById(id) {
    const query = `
            SELECT 
                p.id, p.name, p.full_name, p.category, p.key_features, p.description, p.image_url,
                so.id as size_option_id, so.size, so.regular_price, so.stock, so.is_discounted, so.discounted_price 
            FROM "PRODUCT" p 
            LEFT JOIN "SIZE_OPTION" so 
            ON p.id = so.product_id
            WHERE p.id = $1`;
    
    try {
        const {rows} = await pool.query(query, [id]);
        if (rows.length === 0)
            return null;
        const product = {
            id: rows[0].id,
            name: rows[0].name,
            full_name: rows[0].full_name,
            category: rows[0].category,
            key_features: rows[0].key_features,
            description: rows[0].description,
            image_url: rows[0].image_url,
            size_options: rows.map(row => ({
                id: row.size_option_id,
                size: row.size,
                regular_price: row.regular_price,
                stock: row.stock,
                is_discounted: row.is_discounted,
                discounted_price: row?.discounted_price
            }))};
        return product;
        } catch (error) {
            console.error('Error getting product by id:', error);
            throw new Error('Database query failed');
        }
}




module.exports = {getProductById};