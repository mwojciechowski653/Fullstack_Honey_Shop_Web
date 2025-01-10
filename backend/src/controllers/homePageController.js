const homePageServices = require('../services/homePageService'); 

const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await homePageServices.getTopSellingProducts(); 
    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTopSellingProducts,
};
