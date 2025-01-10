const pool = require('../db');
 
const getTopSellingProducts = async () => {
  const query = `
SELECT
  p.id AS product_id,
  p.name AS product_name,
  p.image_url,
  SUM(op.quantity) AS total_sold
FROM
  "ORDER_PRODUCT" op
JOIN
  "SIZE_OPTION" so ON op.size_option_id = so.id
JOIN
  "PRODUCT" p ON so.product_id = p.id
GROUP BY
  p.id, p.name, p.image_url
ORDER BY
  total_sold DESC
LIMIT 3;
  `;
 
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error('Błąd podczas pobierania najlepiej sprzedających się produktów: ' + error.message);
  }
};
 
module.exports = {
  getTopSellingProducts,
};