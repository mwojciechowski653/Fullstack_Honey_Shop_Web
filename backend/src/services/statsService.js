const pool = require('../db');
const ordersQuery = `
    SELECT 
    COUNT(id) AS total_orders,
    COUNT(CASE WHEN DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE) THEN 1 ELSE NULL END) AS this_month_orders_count,
    COUNT(CASE WHEN DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' THEN 1 ELSE NULL END) AS last_month_orders_count,
    SUM(CASE WHEN DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE) THEN order_value ELSE 0 END) AS this_month_sum,
    SUM(CASE WHEN DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' THEN order_value ELSE 0 END) AS last_month_sum,
    SUM(CASE WHEN DATE(date) = CURRENT_DATE THEN order_value ELSE 0 END) AS today_sum,
    SUM(CASE WHEN DATE(date) = CURRENT_DATE - 1 THEN order_value ELSE 0 END) AS yesterday_sum
    FROM "ORDER"
    `;

    const newUsersQuery = `
        SELECT 
        COUNT(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN 1 ELSE NULL END) AS this_month_new_users,
        COUNT(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' THEN 1 ELSE NULL END) AS last_month_new_users
        FROM "USER"
    `;

    const topProductsQuery = `
        SELECT
        p.name, so.size, SUM(op.quantity) AS total_units_sold, SUM(op.quantity * op.price) AS total_revenue
        FROM "ORDER_PRODUCT" op
        JOIN "SIZE_OPTION" so ON op.size_option_id = so.id
        JOIN "PRODUCT" p ON so.product_id = p.id
        GROUP BY p.name, so.size
        ORDER BY total_revenue DESC
        LIMIT 5
    `;

    const loginStatsQuery = `
                            SELECT 
                                month, 
                                sign_in_count
                            FROM 
                                monthly_sign_ins
                            WHERE 
                                month IN (
                                    TO_CHAR(CURRENT_DATE, 'YYYY-MM'), 
                                    TO_CHAR(CURRENT_DATE - INTERVAL '1 month', 'YYYY-MM')
                            )
                            ORDER BY month DESC;
    `;

    

async function getAdminStats() {
    try {
        const orders = await pool.query(ordersQuery);
        const newUsers = await pool.query(newUsersQuery);
        const topProducts = await pool.query(topProductsQuery);
        const loginStats = await pool.query(loginStatsQuery);

        return {orders: orders.rows[0], newUsers: newUsers.rows[0], topProducts: topProducts.rows, loginStats: loginStats.rows};
    } catch (error) {
        console.error('Error getting admin stats:', error);
        throw new Error('Database query failed');
    }
    
}

module.exports = { getAdminStats };