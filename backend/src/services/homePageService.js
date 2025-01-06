const pool = require('../db');

const productService = {
  getTopSellingProducts: async () => {
    const query = `
      SELECT 
        p.id, p.name, p.full_name, p.image_url, SUM(op.quantity) AS total_sold
      FROM 
        PRODUCT p
      JOIN 
        ORDER_PRODUCT op ON p.id = op.product_id
      GROUP BY 
        p.id
      ORDER BY 
        total_sold DESC
      LIMIT 3;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  getDiscountedProducts: async () => {
    const query = `
      SELECT 
        id, name, full_name, image_url, discounted_price 
      FROM 
        PRODUCT
      WHERE 
        is_discounted = TRUE
      LIMIT 5; -- Maksymalnie 5 produktów
    `;
    const { rows } = await pool.query(query);
    return rows;
  },
};

module.exports = productService;