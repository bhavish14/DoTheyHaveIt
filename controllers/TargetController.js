const https = require('https');
const request = require('request');
const rp = require('request-promise');
var Cookie = require('request-cookies').Cookie;

const TargetController = () => {
  /**
   * @name    /api/target           - {POST}
   * @author  bhavish narayanan     <bhavish.n96@gmail.com>
   * @returns                       - list of all target locations with product stock; code 500
   *                                  on error;
   */
  // const getProductStock = async (req, res) => {
  //   try {
  //     const { query, postal_code, target_key } = req.body;

  //     // get 10 closest stores within 100 miles
  //     let storeOptions = {
  //       uri: `https://redsky.target.com/api/tgt/v3/stores/nearby/${postal_code}?key=${target_key}&limit=10&within=100&unit=mile`,
  //       json: true,
  //     };

  //     let allStoreIds = [];
  //     let allStores = await rp(storeOptions);
  //     allStores = allStores[0].locations;
  //     allStores = allStores.map(e => {
  //       allStoreIds.push(e.location_id);
  //       return {
  //         store_id: e.location_id,
  //         sub_type_code: e.sub_type_code,
  //         address: e.address,
  //         distance: e.distance,
  //         operation_hours:
  //           e.rolling_operating_hours.regular_event_hours.days[0],
  //       };
  //     });
  //     let pricingStoreId = allStores[0].store_id;

  //     // all listings matching query
  //     let allListingsOptions = {
  //       uri: `https://redsky.target.com/v2/plp/search/?channel=web&count=2&keyword=soda&offset=0&pageId=%2Fs%2Fsoda&pricing_store_id=${pricingStoreId}&key=${target_key}`,
  //       json: true,
  //     };

  //     let allListingsIds = [];
  //     let allListings = await rp(allListingsOptions);
  //     allListings = allListings.search_response.items.Item;
  //     allListings = allListings.map(e => {
  //       allListingsIds.push(e.tcin);
  //       return {
  //         title: e.title,
  //         tcin: e.tcin,
  //         description: e.description,
  //         image_url: `${e.images[0].base_url}${e.images[0].primary}`,
  //         average_rating: e.average_rating,
  //       };
  //     });

  //     allListings = allListings.map(e => {
  //       let tcin = e.tcin;
  //       return {
  //         ...e,
  //         url: `https://api.target.com/fulfillment_aggregator/v1/fiats/${tcin}?key=${process.env.TGT_API_KEY}&nearby=75252&limit=20&requested_quantity=1&radius=100`,
  //       };
  //     });

  //     return res.status(200).json({
  //       success: true,
  //       data: allListings,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(500).json({
  //       success: false,
  //     });
  //   }
  // };

  /**
   * @name    /api/key/et           - {GET}
   * @author  bhavish narayanan     <bhavish.n96@gmail.com>
   * @returns                       - GET target api key; code 500 on error;
   */
  const getKey = async (req, res) => {
    try {
      const visitorIDPromise = new Promise((resolve, reject) => {
        request.get('https://www.target.com', function(err, response, body) {
          if (err) {
            reject('failed to get visitor ID');
          }
          var rawcookies = response.headers['set-cookie'];
          rawcookies = rawcookies.filter(e => e.startsWith('visitorId'));
          rawcookies = rawcookies[0].split(';')[0].split('=')[1];
          resolve(rawcookies);
        });
      });
      return res.status(200).json({
        success: true,
        data: {
          redsky_key: await visitorIDPromise,
          api_key: process.env.TGT_API_KEY,
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
