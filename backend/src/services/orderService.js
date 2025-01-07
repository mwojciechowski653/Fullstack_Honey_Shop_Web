const pool = require('../db');  // Establishing a connection with the database

// Asynchronous function to fetch all orders with optional filters
async function getAllOrders(filters = {}) {

    // Destructuring the filters object to extract specific filter values
    const { name, year, date } = filters;
    console.log(filters);

    // Main SQL query to retrieve order-related data from multiple tables
    let query =
        `
        SELECT
            o.id as order_id, o.user_id, o.date, o.delivered, o.status, o.invoice_id, o.order_value,
            op.id as order_product_id, op.size_option_id,
            so.id as size_option_id, so.size, so.stock, so.regular_price, so.is_discounted, so.discounted_price,
            p.id as product_id, p.name as product_name, p.full_name as product_full_name, p.category as product_category, p.key_features, p.description as product_description, p.image_url as product_image_url,
            u.id as user_id, u.first_name, u.last_name, u.email, u.password, u.is_admin, u.created_at, u.phone,
            ua.country, ua.city, ua.street, ua.street_number, ua.postal_code
        FROM "ORDER" o
        LEFT JOIN "ORDER_PRODUCT" op ON o.id = op.order_id
        LEFT JOIN "SIZE_OPTION" so ON op.size_option_id = so.id
        LEFT JOIN "PRODUCT" p ON so.product_id = p.id
        LEFT JOIN "USER" u ON o.user_id = u.id
        LEFT JOIN "USER_ADDRESS" ua ON u.id = ua.user_id
        `;

    const conditions = [];   // Array to hold conditions for filtering the query

    // If a 'name' filter is provided, add it to the conditions (search by user's full name)
    if (name) {
        conditions.push(`LOWER(u.first_name || ' ' || u.last_name) LIKE '%${name.toLowerCase()}%'`);
    }

    // If a 'year' filter is provided, add it to the conditions (filter orders by year)
    if (year) {
        conditions.push(`EXTRACT(YEAR FROM o.date) = '${parseInt(year, 10)}'`);
    }

    // If a 'date' filter is provided, add it to the conditions (filter orders by specific date)
    if (date) {
        conditions.push(`DATE(o.date) = '${date}'`);
    }

    // If there are any conditions, append them to the main query
    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(` AND `);
    }

    // Add an ORDER BY clause to sort the orders by date in descending order
    query += ` ORDER BY o.date DESC`;

    // Log the constructed query (useful for debugging)
    //console.log(query);
    console.log(conditions);

    try {
        // Execute the query against the database and get the result
        const { rows } = await pool.query(query);

        // If no rows (orders) are returned, return null
        if (rows.length === 0) return null;

        // Reduce the rows into a structured list of orders, with products and size options nested
        const orders = rows.reduce((acc, row) => {
            // Find the order in the accumulator based on order_id
            const order = acc.find(o => o.id === row.order_id);
            if (!order) {
                // If the order doesn't exist yet, create a new order object
                acc.push({
                    id: row.order_id,
                    user: {
                        id: row.user_id,
                        first_name: row.first_name,
                        last_name: row.last_name,
                        email: row.email,
                        password: row.password,
                        is_admin: row.is_admin,
                        created_at: row.created_at,
                        phone: row.phone,
                        address: {
                            country: row.country,
                            city: row.city,
                            street: row.street,
                            street_number: row.street_number,
                            postal_code: row.postal_code,
                        },
                    },
                    date: row.date,
                    delivered: row.delivered,
                    status: row.status,
                    invoice_id: row.invoice_id,
                    order_value: row.order_value,
                    products: [{
                        id: row.product_id,
                        name: row.product_name,
                        full_name: row.product_full_name,
                        category: row.product_category,
                        key_features: row.key_features,
                        description: row.product_description,
                        image_url: row.product_image_url,
                        size_options: [{
                            id: row.size_option_id,
                            size: row.size,
                            stock: row.stock,
                            regular_price: row.regular_price,
                            is_discounted: row.is_discounted,
                            discounted_price: row.discounted_price,
                        }],
                    }],
                });
            } else {
                // If the order already exists, check if the product exists within the order
                const product = order.products.find(p => p.id === row.product_id);
                if (!product) {
                    // If the product does not exist, add it to the order
                    order.products.push({
                        id: row.product_id,
                        name: row.product_name,
                        full_name: row.product_full_name,
                        category: row.product_category,
                        key_features: row.key_features,
                        description: row.product_description,
                        image_url: row.product_image_url,
                        size_options: [{
                            id: row.size_option_id,
                            size: row.size,
                            stock: row.stock,
                            regular_price: row.regular_price,
                            is_discounted: row.is_discounted,
                            discounted_price: row.discounted_price,
                        }],
                    });
                } else {
                    // If the product exists, add the new size option to the product
                    product.size_options.push({
                        id: row.size_option_id,
                        size: row.size,
                        stock: row.stock,
                        regular_price: row.regular_price,
                        is_discounted: row.is_discounted,
                        discounted_price: row.discounted_price,
                    });
                }
            }
            return acc;  // Return the accumulator with the updated order
        }, []);

        return orders;  // Return the structured list of orders
    } catch (error) {
        // If an error occurs, log it and throw a new error
        console.error('Error during getting all products: ', error.message);
        throw new Error('Database query failed');
    }
}

module.exports = { getAllOrders };  // Exporting the getAllOrders function for use in other modules
