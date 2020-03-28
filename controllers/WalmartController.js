const request = require('request');
const rp = require('request-promise');

const WalmartController = () => {
  /**
   * @name    /api/walmart/stores     - {POST}
   * @author  bhavish narayanan       <bhavish.n96@gmail.com>
   * @returns                         - list of all walmart stores within the mile range
   */
  const getWalmartStores = async (req, res) => {
    try {
      let {
        mile_range,
        postal_code
      } = req.body;
      let options = {
        uri: `https://www.walmart.com/store/finder/electrode/api/stores?singleLineAddr=${postal_code}&distance=${mile_range}`,
        json: true,
      };

      let stores = await rp(options);

      return res.status(200).json({
        success: true,
        data: stores
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        msg: err
      });
    }
  }

  return {
    getWalmartStores,
  }
};

module.exports = WalmartController;