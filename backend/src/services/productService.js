const pool = require("../db");

async function getProductById(id) {
  const query = `
            SELECT 
                p.id, p.name, p.full_name, p.category, p.key_features, p.description,
                so.id as size_option_id, so.size, so.regular_price, so.stock, so.image_url, so.is_discounted, so.discounted_price 
            FROM "PRODUCT" p 
            LEFT JOIN "SIZE_OPTION" so 
            ON p.id = so.product_id
            WHERE p.id = $1`;

  try {
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    const product = {
      id: rows[0].id,
      name: rows[0].name,
      full_name: rows[0].full_name,
      category: rows[0].category,
      key_features: rows[0].key_features,
      description: rows[0].description,
      size_options: rows.map((row) => ({
        id: row.size_option_id,
        size: row.size,
        regular_price: row.regular_price,
        stock: row.stock,
        image_url: row.image_url,
        is_discounted: row.is_discounted,
        discounted_price: row?.discounted_price,
      })),
    };
    return product;
  } catch (error) {
    console.error("Error getting product by id:", error);
    throw new Error("Database query failed");
  }
}

async function getProductToEditById(id) {
  const query = `
            SELECT 
                p.id, p.name, p.full_name, p.category, p.key_features, p.description,
                so.id as size_option_id, so.size, so.regular_price, so.stock, p.image_url 
            FROM "PRODUCT" p 
            LEFT JOIN "SIZE_OPTION" so 
            ON p.id = so.product_id
            WHERE so.id = $1`;

  try {
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    const product = {
      id: rows[0].id,
      name: rows[0].name,
      full_name: rows[0].full_name,
      category: rows[0].category,
      key_features: rows[0].key_features,
      description: rows[0].description,
      size_option_id: rows[0].size_option_id,
      size: rows[0].size,
      regular_price: rows[0].regular_price,
      stock: rows[0].stock,
      image_url: rows[0].image_url,
    };
    return product;
  } catch (error) {
    console.error("Error getting product by id:", error);
    throw new Error("Database query failed");
  }
}

async function getProducts() {
  const query = `
    SELECT 
        so.id AS size_option_id,
        p.image_url AS img_link,
        p.name,
        p.category,
        so.size,
        so.stock,
        COALESCE(SUM(op.quantity), 0) AS sold,
        so.regular_price AS price
    FROM "SIZE_OPTION" so
    JOIN "PRODUCT" p ON so.product_id = p.id
    LEFT JOIN "ORDER_PRODUCT" op ON so.id = op.size_option_id
    GROUP BY so.id, p.image_url, p.name, p.category, so.size, so.stock, so.regular_price
    ORDER BY sold DESC;
  `;

  try {
    const result = await pool.query(query);

    // Format the response as an array of objects
    const response = result.rows.map((row) => ({
      id: row.size_option_id,
      img_link: row.img_link,
      name: row.name,
      category: row.category,
      size: row.size,
      stock: row.stock,
      sold: row.sold,
      price: parseFloat(row.price),
    }));

    return response;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

module.exports = {
  getProductById,
  getProductToEditById,
  getProducts,
};
