const productsService = require("../services/productService");

async function getProductById(req, res) {
  const productId = parseInt(req.params.id, 10);
  if (isNaN(productId)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid product ID" }); // 400 Bad Request
  }

  try {
    const product = await productsService.getProductById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" }); // 404 Not Found
    }

    res.json({ success: true, product }); // 200 OK
  } catch (error) {
    console.error("Error getting product by id:", error);
    res.status(500).json({ success: false, error: error.message }); // 500 Internal Server Error
  }
}

async function getProductToEditById(req, res) {
  const productId = parseInt(req.params.id, 10);
  if (isNaN(productId)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid product ID" }); // 400 Bad Request
  }

  try {
    const product = await productsService.getProductToEditById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" }); // 404 Not Found
    }

    res.json({ success: true, product }); // 200 OK
  } catch (error) {
    console.error("Error getting product by id:", error);
    res.status(500).json({ success: false, error: error.message }); // 500 Internal Server Error
  }
}

async function getProducts(req, res) {
  try {
    const products = await productsService.getProducts();

    if (!products) {
      return res
        .status(404)
        .json({ success: false, error: "There is no products" }); // 404 Not Found
    }

    res.json({ success: true, products }); // 200 OK
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ success: false, error: error.message }); // 500 Internal Server Error
  }
}

async function deleteProductBySizeOptionId(req, res) {
  const pool = require("../db");

  const sizeOptionId = parseInt(req.params.id, 10);

  if (isNaN(sizeOptionId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid size option ID" });
  }
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Find the product_id associated with this size_option_id
    const findProductQuery = `
      SELECT product_id 
      FROM "SIZE_OPTION"
      WHERE id = $1
    `;
    const result = await client.query(findProductQuery, [sizeOptionId]);

    if (result.rows.length === 0) {
      throw new Error("Size option not found");
    }

    const productId = result.rows[0].product_id;

    // Delete from ORDER_PRODUCT where size_option_id matches
    const deleteOrderProductQuery = `
      DELETE FROM "ORDER_PRODUCT" 
      WHERE size_option_id = $1
    `;
    await client.query(deleteOrderProductQuery, [sizeOptionId]);

    // Delete from SIZE_OPTION where id matches
    const deleteSizeOptionQuery = `
      DELETE FROM "SIZE_OPTION" 
      WHERE id = $1
    `;
    await client.query(deleteSizeOptionQuery, [sizeOptionId]);

    // Check if there are any other SIZE_OPTION entries for the same product_id
    const checkSizeOptionQuery = `
      SELECT COUNT(*) AS size_count 
      FROM "SIZE_OPTION" 
      WHERE product_id = $1
    `;
    const sizeOptionCountResult = await client.query(checkSizeOptionQuery, [
      productId,
    ]);
    const sizeOptionCount = parseInt(
      sizeOptionCountResult.rows[0].size_count,
      10
    );

    if (sizeOptionCount === 0) {
      // Delete the PRODUCT if no other SIZE_OPTION exists
      const deleteProductQuery = `
        DELETE FROM "PRODUCT" 
        WHERE id = $1
      `;
      await client.query(deleteProductQuery, [productId]);
    }

    await client.query("COMMIT");
    res.status(200).json({
      success: true,
      message: "Product and associated data deleted successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the product",
    });
  } finally {
    client.release();
  }
}
module.exports = {
  getProductById,
  getProductToEditById,
  getProducts,
  deleteProductBySizeOptionId,
};
