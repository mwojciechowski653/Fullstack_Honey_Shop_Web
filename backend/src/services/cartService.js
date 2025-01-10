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

async function placeOrder(body, userId) {
    let res = {success: false};
    const {cart, deliveryOptionId} = body;
    if(cart.length === 0) {
        return {success: false, message: 'Cart is empty'};
    }
    const sizeOptionIds = cart.map(item => item.sizeOptionId);
    const sizeOptionsQuery = `
        SELECT
        p.id, p.name, so.id AS size_option_id, so.size, so.regular_price, so.discounted_price, so.is_discounted, so.stock
        FROM "PRODUCT" p
        JOIN "SIZE_OPTION" so ON p.id = so.product_id
        WHERE so.id = ANY($1)
    `;
    let sizeOptionRows;
    try {
        const {rows} = await pool.query(sizeOptionsQuery, [sizeOptionIds]);
        if(rows.length === 0) {
            return {success: false, message: 'Invalid size option ID'};
        }
        sizeOptionRows = rows;
    } catch (error) {
        console.error('Error during getting cart summary:', error);
        throw new Error('Database query failed');
    }

    // integrate data to cart varible
    cart.forEach(item => {
        const sizeOption = sizeOptionRows.find(row => row.size_option_id === item.sizeOptionId);
        item.name = sizeOption.name + ' - ' + sizeOption.size + 'g';
        item.regularPrice = sizeOption.regular_price;
        item.discountedPrice = sizeOption.discounted_price;
        item.isDiscounted = sizeOption.is_discounted;
        item.stock = sizeOption.stock;
    });

    // check if all products are available
    const unavailableProducts = cart.filter(item => item.stock < item.numberOfUnits);
    if(unavailableProducts.length > 0) {
        res.success = false;
        res.message = 'Some products are not available' + unavailableProducts.map(item => item.name).join(', ');
    }
    
    // calculate total price
    const totalCartPrice = cart.reduce((total, item) => {
        const price = item.isDiscounted ? item.discountedPrice : item.regularPrice;
        return total + price * item.numberOfUnits;
    }, 0);

    const deliveryPrice = getDeliveryPrice(deliveryOptionId);
    const totalPrice = totalCartPrice + deliveryPrice;

    // start transaction
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const orderQuery = `
        INSERT INTO "ORDER" (user_id, status, order_value)
        VALUES ($1, $2, $3)
        RETURNING id
        `;

        const {rows} = await client.query(orderQuery, [userId, 'Processing', totalPrice]);
        const orderId = rows[0].id;

        // insert order products
        const orderProductsQuery = `
            INSERT INTO "ORDER_PRODUCT" (order_id, size_option_id, quantity, price)
            VALUES ($1, $2, $3, $4)
        `;
        for(const item of cart) {
            await client.query(orderProductsQuery, [orderId, item.sizeOptionId, item.numberOfUnits, item.isDiscounted ? item.discountedPrice : item.regularPrice]);
        }

        // reduce stock
        const updateStockQuery = `
            UPDATE "SIZE_OPTION"
            SET stock = stock - $1
            WHERE id = $2
        `;

        for(const item of cart) {
            await client.query(updateStockQuery, [item.numberOfUnits, item.sizeOptionId]);
        }


        // commit transaction
        await client.query('COMMIT');
        res = {success: true, orderId};
        return res;
    } catch (error) {
        // rollback transaction
        await client.query('ROLLBACK');
        console.error('Error during placing order:', error);
        throw new Error('Database query failed');
    } finally {
        client.release();
    }

}

function getDeliveryPrice(deliveryOptionId) {
    switch(deliveryOptionId) {
        case 1:
            return 5;
        case 2:
            return 7;
        case 3:
            return 11;
        default:
            throw new Error('Invalid delivery option');
    }
}
module.exports = { getCartSummary, placeOrder };