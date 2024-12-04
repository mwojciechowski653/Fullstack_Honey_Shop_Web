const pool = require('../db');                  // getting conection with database

// function which get all products
async function getAllProducts() {
    const query = `
        SELECT
            p.id, p.name, p.full_name, p.category, p.key_features, p.description, p.image_url,
            so.id as size_option_id, so.size, so.regular_price, so.stock, so.is_discounted, so.discounted_price 
        FROM "PRODUCT" p 
        LEFT JOIN "SIZE_OPTION" so
        `;

    try {
        const { rows } = await pool.query(query);           // getting data from database thanks to query question

        if (rows.length === 0) return null;                 // checking if rows are not null

        const products = rows.reduce((acc, row) => {            // acc - new table where we put our product, empty at the beginning; row - one row of rows
            const product = acc.find(p => p.id === row.id);     // checking if product exist
            if (!product) {                                     // if product does not exist
                acc.push({
                    id: row.id,
                    name: row.name,
                    full_name: row.full_name,
                    category: row.category,
                    key_features: row.key_features,
                    description: row.description,
                    image_url: row.image_url,
                    size_options: [{
                        id: row.size_option_id,
                        size: row.size,
                        regular_price: row.regular_price,
                        stock: row.stock,
                        is_discounted: row.is_discounted,
                        discounted_price: row.discounted_price,
                    }]
                })
            } else {                                            // if product exist, add another size to existing product
                product.size_options.push({
                    id: row.size_option_id,
                    size: row.size,
                    regular_price: row.regular_price,
                    stock: row.stock,
                    is_discounted: row.is_discounted,
                    discounted_price: row.discounted_price,
                })
            }
            return acc;
        }, []);
        return products;
    } catch (error) {
        console.error('Error during getting all products: ', error);
        throw new Error('Database query failed');
    }
}

module.exports = { getAllProducts }
