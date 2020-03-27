const UtilsController = () => {
  const getGCSKey = async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        data: process.env.GOOGLE_CLOUD_KEY,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
      });
    }
  };

  return {
    getGCSKey,
  };
};

module.exports = UtilsController;
