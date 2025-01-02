const pool = require('../db');						// getting conection with database

async function getAllOrders(filters = {}) {
    const { name, year, date } = filters;

    let query =                                   // query question which get all informations involved in orders
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

    const queryParams = [];                                             // query parameters
    const conditions = [];                                              // part of query

    if (name) {
        conditions.push(`LOWER(u.first_name || ' ' || u.last_name) LIKE $${queryParams.length + 1}`);
        queryParams.push(`%${name.toLowerCase()}%`);
    }

    if (year) {
        conditions.push(`EXTRACT(month FROM o.date) = $${queryParams.length + 1}`);
        queryParams.push(parseInt(year, 10));
    }

    if (date) {
        conditions.push(`DATE(o.date) = $${queryParams.length + 1}`);
        queryParams.push(date);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(` AND `);
    }
    query += ` ORDER BY o.date DESC`;

    try {
        const { rows } = await pool.query(query)                        // getting data from database thanks to query question

        if (rows.length === 0) return null;                             // checking if rows are not null

        const orders = rows.reduce((acc, row) => {
            const order = acc.find(o => o.id === row.order_id);
            if (!order) {
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
            } else {                                                                // order exist, checking if product exist not size_option
                const product = order.products.find(p => p.id === row.product_id);
                if (!product) {                                                     // order exist but product does not
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
                } else {                                                           // order exist, product exist too, but not size_option
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
            return acc;
        }, []);
        return orders;
    } catch (error) {
        console.error('Error during getting all products: ', error.message);
        throw new Error('Database query failed');
    }
}

module.exports = { getAllOrders };