const express = require('express');
const {authenticateToken, authenticateAdmin} = require('./middleware/authenticate');
const productController = require('./controllers/productController');
const shopController = require('./controllers/shopController');
const orderController = require('./controllers/orderController');
const homePageController = require('./controllers/homePageController');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const cartController = require('./controllers/cartController');
const statsController = require('./controllers/statsController');

const router = express.Router();
const customerController = require('./controllers/customerController');

//Customers routes
router.get('/customers', customerController.getCustomersByFilters);

//Product routes
router.get('/products/:id', productController.getProductById);
router.get('/products', shopController.getAllProducts);
router.get('/orders', orderController.getAllOrders);
router.get('/users/:id', userController.getUserById);
//Home page routes

router.get('/home', homePageController.getTopSellingProducts);
 

router.get('/home', homePageController.getHomePageProducts);
router.get('/orders/:id', orderController.getOrderById);

router.put('/users/:id', userController.updateUserById);

//Auth routes
router.post('/auth/signup', authController.signUpValidators, authController.signUp);
router.post('/auth/login', authController.loginValidators, authController.login);

// cart and payment
router.post('/cart', cartController.getCartSummary);
router.post('/order', authenticateToken, cartController.placeOrderValidators, cartController.placeOrder);

router.get('/stats', statsController.getStats);


const cors = require("cors");
router.use(express.json()); // Parse JSON bodies
router.use(cors());

// Get products
router.get("/products_edit/:id", productController.getProductToEditById);
router.get("/products-admin", productController.getProducts);

// Delete products
router.delete(
  "/product_delete/:id",
  productController.deleteProductBySizeOptionId
);

//Post Product
const multer = require("multer");
const pool = require("./db");
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory
const AWS = require("aws-sdk");
require("dotenv").config();

// Configure AWS SDK for Supabase S3
const s3 = new AWS.S3({
  accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID,
  secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY,
  region: process.env.SUPABASE_REGION,
  endpoint: process.env.SUPABASE_ENDPOINT,
  s3ForcePathStyle: true, // Necessary for S3 compatibility with Supabase
});

// Endpoint to handle adding a product
router.post("/add_product", upload.single("image"), async (req, res) => {
  try {
    // Extract fields from the request
    const {
      title,
      subtitle,
      productType,
      keyFeature1,
      keyFeature2,
      keyFeature3,
      size,
      stock,
      price,
      description,
    } = req.body;

    // Image file
    const imageFile = req.file;
    // Validate required fields
    if (
      !title ||
      !subtitle ||
      !productType ||
      !keyFeature1 ||
      !keyFeature2 ||
      !keyFeature3 ||
      !size ||
      !stock ||
      !price ||
      !description ||
      !imageFile
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Combine key features into a single string
    const keyFeatures = `${keyFeature1};${keyFeature2};${keyFeature3}`;

    // Upload image to Supabase bucket
    const bucketName = "products";
    const fileName = `${imageFile.originalname}_${Date.now()}`;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: imageFile.buffer,
      ContentType: imageFile.mimetype,
      ACL: "public-read", // Allow public access to the image
    };

    const uploadResult = await s3.upload(params).promise();
    const imageUrl = uploadResult.Location.replace("s3/", "object/public/"); // Get the public URL of the uploaded image
    // Insert data into the PRODUCT table
    const productQuery = `
      INSERT INTO "PRODUCT" (name, full_name, category, key_features, description, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
    const productValues = [
      title,
      subtitle,
      productType,
      keyFeatures,
      description,
      imageUrl,
    ];
    const productResult = await pool.query(productQuery, productValues);

    // Get the ID of the newly inserted product
    const productId = productResult.rows[0].id;

    try {
      // Insert data into the SIZE_OPTION table
      const sizeOptionQuery = `
        INSERT INTO "SIZE_OPTION" (product_id, size, stock, regular_price, is_discounted, discounted_price)
        VALUES ($1::int, $2::int, $3::int, $4::float, false, NULL);
      `;
      const sizeOptionValues = [productId, size, stock, price];
      await pool.query(sizeOptionQuery, sizeOptionValues);

      // Send success response
      res.status(200).json({ message: "Product added successfully!" });
    } catch (error) {
      console.error("Error adding size option:", error);

      // Rollback: Delete the product if size option insertion fails
      const rollbackQuery = `
        DELETE FROM "PRODUCT"
        WHERE id = $1;
      `;
      await pool.query(rollbackQuery, [productId]);

      res.status(500).json({
        error:
          "An error occurred while adding the size option. The product was not saved.",
      });
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the product." });
  }
});

// Put product
router.put("/products_update_same_photo/:id", async (req, res) => {
  const sizeOptionId = parseInt(req.params.id, 10); // Get the `id` parameter from the URL
  const {
    name,
    full_name,
    category,
    key_features,
    description,
    size,
    stock,
    regular_price,
  } = req.body; // Extract data from the request body

  try {
    // Begin a transaction
    await pool.query("BEGIN");

    // Find the associated product_id from SIZE_OPTION
    const sizeOptionResult = await pool.query(
      `SELECT product_id FROM "SIZE_OPTION" WHERE id = $1`,
      [sizeOptionId]
    );

    if (sizeOptionResult.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Size option not found." });
    }

    const productId = sizeOptionResult.rows[0].product_id;

    // Update the PRODUCT table
    await pool.query(
      `UPDATE "PRODUCT"
       SET name = $1, full_name = $2, category = $3, key_features = $4, description = $5
       WHERE id = $6`,
      [name, full_name, category, key_features, description, productId]
    );

    // Update the SIZE_OPTION table
    await pool.query(
      `UPDATE "SIZE_OPTION"
       SET size = $1::int, stock = $2::int, regular_price = $3::float
       WHERE id = $4`,
      [size, stock, regular_price, sizeOptionId]
    );

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Product and size option updated successfully.",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query("ROLLBACK");
    console.error("Error updating product data:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update product data." });
  }
});

// Endpoint to update product with a new photo
router.put(
  "/products_update_new_photo/:id",
  upload.single("image"),
  async (req, res) => {
    const sizeOptionId = parseInt(req.params.id, 10); // Get `id` parameter from the URL
    const {
      name,
      full_name,
      category,
      key_features,
      description,
      size,
      stock,
      regular_price,
    } = req.body; // Extract data from the request body
    const imageFile = req.file; // Extract the uploaded image file

    // Validate input
    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required." });
    }

    try {
      // Begin a transaction
      await pool.query("BEGIN");

      // Retrieve the associated product_id from SIZE_OPTION
      const sizeOptionResult = await pool.query(
        `SELECT product_id FROM "SIZE_OPTION" WHERE id = $1`,
        [sizeOptionId]
      );

      if (sizeOptionResult.rowCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Size option not found." });
      }

      const productId = sizeOptionResult.rows[0].product_id;

      // Upload the new image to the Supabase S3 bucket
      const bucketName = "products";
      const fileName = `${imageFile.originalname}_${Date.now()}`;
      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: imageFile.buffer,
        ContentType: imageFile.mimetype,
        ACL: "public-read", // Allow public access to the image
      };

      const uploadResult = await s3.upload(params).promise();
      const newImageUrl = uploadResult.Location.replace(
        "s3/",
        "object/public/"
      ); // Get the public URL of the uploaded image

      // Update the PRODUCT table with the new image URL
      await pool.query(
        `UPDATE "PRODUCT"
         SET name = $1, full_name = $2, category = $3, key_features = $4, description = $5, image_url = $6
         WHERE id = $7`,
        [
          name,
          full_name,
          category,
          key_features,
          description,
          newImageUrl,
          productId,
        ]
      );

      // Update the SIZE_OPTION table
      await pool.query(
        `UPDATE "SIZE_OPTION"
         SET size = $1::int, stock = $2::int, regular_price = $3::float
         WHERE id = $4`,
        [size, stock, regular_price, sizeOptionId]
      );

      // Commit the transaction
      await pool.query("COMMIT");

      res.status(200).json({
        success: true,
        message: "Product updated successfully with new photo!",
      });
    } catch (error) {
      // Rollback transaction in case of an error
      await pool.query("ROLLBACK");
      console.error("Error updating product data:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update product data." });
    }
  }
);
module.exports = router;
