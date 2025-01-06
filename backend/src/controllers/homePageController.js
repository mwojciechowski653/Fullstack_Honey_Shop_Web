const productService = require('../services/productService');

const productController = {
  getHomePageProducts: async (req, res) => {
    try {
      const topSellingProducts = await productService.getTopSellingProducts();
      const discountedProducts = await productService.getDiscountedProducts();

      res.json({
        topSellingProducts,
        discountedProducts,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = productController;