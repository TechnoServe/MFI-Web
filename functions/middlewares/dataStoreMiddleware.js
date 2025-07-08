module.exports.dataStoreMiddleware = (store) => (req, res, next) => {
  req.store = store;
  next();
};
