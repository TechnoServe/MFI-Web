const {isCompanyAdmin} = require('../guards');
const {USER_TYPES} = require('../constants');
const {verifyJwt, validate} = require('../utils');

module.exports.validateSignUp = require('./sign-up-middleware.js');

/**
 * Middleware to validate the presence and correctness of the Authorization header and verify JWT.
 * Attaches the authenticated user to the request object.
 * @param {Object} store - Data access layer used to fetch user details.
 * @returns {Function} Express middleware.
 */
module.exports.authorization = (store) => async (req, res, next) => {
  // Validation rule
  const rules = {
    authorization: {
      presence: {
        allowEmpty: false,
        message: 'The authorization header is required.',
      },
    },
  };

  // Validate headers
  const errors = validate(req.headers, rules);

  // Handle validation errors
  if (errors) return res.status(400).json({message: 'Some inputs are invalid.', errors: errors});

  // Extract bearer token
  let token = req.headers['authorization'].split(' ')[1];
  if (token) token = token.trim();
  if (!token) return res.status(401).json({message: 'The bearer token can not be empty.'});

  try {
    let verifiedUserUid;

    try {
      const {uid} = await verifyJwt(token);
      verifiedUserUid = uid;
    } catch (err) {
      const message = 'Failed to verify JWT.';
      console.error(message, err);
      res.status(401).json({message});
      return;
    }

    req.user = await store.getUserWithAssociatedData(verifiedUserUid);

    next();
  } catch (err) {
    const message = 'Failed to authorize user.';
    console.error(err);
    res.status(401).json({message});
  }
};

/**
 * Middleware to check if the authenticated user is a company admin for the provided company ID.
 * @param {Object} store - Data access layer used for authorization checks.
 * @returns {Function} Express middleware.
 */
module.exports.isCompanyAdmin = (store) => async (req, res, next) => {
  const constraints = {
    id: {
      type: 'string',
      presence: {allowEmpty: false},
    },
  };

  const {params} = req;

  const errors = validate(params, constraints);

  if (errors) return res.status(400).json({errors});

  const {id} = params;

  try {
    if (!isCompanyAdmin(store, req.user, id)) {
      return res.status(401).json({message: 'Unauthorised.'});
    }
    next();
  } catch (error) {
    return res.status(401).json({message: 'Unauthorised.'});
  }
};

/**
 * Middleware factory to check if the user's role passes a custom policy function.
 * @param {Function} policy - A function that takes a role and returns a boolean.
 * @returns {Function} Express middleware.
 */
module.exports.isAuthorized = (policy) => (req, res, next) => {
  if (policy(req.user.role)) {
    next();
  } else {
    return res.status(401).json({message: 'Unauthorised.'});
  }
};

/**
 * Middleware to check if the user is an MFI admin based on user_type and admin_user presence.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object|undefined} Sends a 401 response if unauthorized; otherwise, calls next().
 */
module.exports.isMFIAdmin = (req, res, next) => {
  if (
    req.user.user_type.value.toLowerCase() === USER_TYPES.ADMIN
    && req.user.admin_user
    && req.user.admin_user.id
    && req.user.admin_user
  ) {
    next();
  } else {
    return res.status(401).json({message: 'Unauthorised.'});
  }
};
