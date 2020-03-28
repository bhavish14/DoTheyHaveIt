const routes = {
  // utils
  'GET /key/gcs': 'UtilsController.getGCSKey',

  // target

  'GET /key/target': 'TargetController.getKey',
  'POST /target': 'TargetController.getProductStock',

  // walmart
  'POST /walmart/stores': 'WalmartController.getWalmartStores',

};

module.exports = routes;