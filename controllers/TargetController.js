const request = require('request');
const rp = require('request-promise');

const TargetController = () => {
  /**
   * @name    /api/key/et           - {GET}
   * @author  bhavish narayanan     <bhavish.n96@gmail.com>
   * @returns                       - GET target api key; code 500 on error;
   */
  const getKey = async (req, res) => {
    try {
      const visitorIDPromise = new Promise((resolve, reject) => {
        request.get('https://www.target.com', (err, response, body) => {
          if (response) {
            let rawcookies = response.headers['set-cookie'];
            rawcookies = rawcookies.filter(e => e.startsWith('visitorId'));
            rawcookies = rawcookies[0].split(';')[0].split('=')[1];
            resolve(rawcookies);
          } else {
            reject(0);
          }
        });
      });
      return res.status(200).json({
        success: true,
        data: {
          redsky_key: await visitorIDPromise,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
      });
    }
  };

  /**
   * @name    /api/target           - {POST}
   * @author  bhavish narayanan     <bhavish.n96@gmail.com>
   * @returns                       - list of all target locations with product stock; code 500
   *                                  on error;
   */
  const getProductStock = async (req, res) => {
    try {
      let { tcin, postal_code, mile_range } = req.body;

      let options = {
        uri: `https://api.target.com/fulfillment_aggregator/v1/fiats/${tcin}?key=${
          process.env.TGT_API_KEY
        }&nearby=${Number(
          postal_code,
        )}&limit=25&requested_quantity=1&radius=${Number(mile_range)}`,
        json: true,
      };

      let products = await rp(options);

      return res.status(200).json({
        success: true,
        data: {
          product_id: products.products[0].product_id,
          locations: products.products[0].locations,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
      });
    }
  };

  return {
    // core functions
    getProductStock,
    getKey,
  };
};

module.exports = TargetController;
