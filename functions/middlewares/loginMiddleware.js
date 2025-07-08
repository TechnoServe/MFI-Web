const {validate} = require('../utils');

const constraints = {
  email: {
    presence: {allowEmpty: false},
    email: true,
  },
};
/**
 * Middleware to validate the login request body for required fields and email format.
 * @returns {Function} Express middleware that validates the request body and returns 400 on failure.
 */
module.exports.validateLogin = () => (req, res, next) => {
  try {
    const error = validate(req.body, constraints);
    if (error) {
      return res.status(400).json({error});
    }
    next();
  } catch (e) {
    return res.status(500).json({error: e.message});
  }
};
