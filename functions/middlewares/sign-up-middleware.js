/**
 * Middleware to validate sign-up request data for company registration.
 * Ensures fields like full name, company email, company name, company size, and brands are present and valid.
 * Adds a custom validator for checking if the company email already exists.
 *
 * @param {Object} store - Data access layer for fetching company sizes and users.
 * @returns {Function} Express middleware function to validate the request body.
 */
const {validate, sanitizeEmailAddress} = require('../utils');

module.exports = (store) => async (req, res, next) => {
  try {
    // const productTypes = (await store.getProductTypes()).map(({id}) => id);
    const companySizes = (await store.getCompanySizes()).map(({id}) => id);

    validate.validators.companyEmailExists = (value) => new Promise((resolve, reject) => {
      store
        .getAuthUserByEmail(sanitizeEmailAddress(value))
        .then(() => resolve())
        .catch(() => resolve('User not found.'));
    });

    const constraints = {
      'full-name': {
        type: 'string',
        presence: {allowEmpty: false},
      },
      'company-email': {
        type: 'string',
        presence: {allowEmpty: false},
        email: {
          message: 'Provide a valid email address.',
        },
      },
      'company-name': {
        type: 'string',
        presence: {allowEmpty: false},
      },
      'company-size': {
        type: 'string',
        presence: {allowEmpty: false},
        inclusion: companySizes,
      },
      'brands': {
        type: 'array',
        presence: {allowEmpty: false},
        // TODO: add validator for it
      },
    };

    validate.async(req.body, constraints).then(
      () => next(),
      (errors) => res.status(400).json({errors})
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Some error occured.'});
  }
};
