const {sendEmail, signJwtToken, paginationConstraint, validate} = require('../utils');
const {ActivityLog} = require('../utils/activity-log');
const {COLLECTIONS, ACTIVITY_LOG_ACTIONS, USER_TYPES} = require('../constants');

/**
 * Retrieves a list of product types.
 * @param {Object} store - Data access object.
 * @returns {Function} Express route handler.
 */
module.exports.productTypeList = (store) => (req, res) => {
  store
    .getProductTypes()
    .then((list) => res.json(list))
    .catch((err) => {
      const message = 'Failed to fetch product type list.';
      console.error(err, message);
      res.status(500).json({message});
    });
};

/**
 * Retrieves micro nutrients for a specific product by ID.
 * @param {Object} store - Data access object.
 * @returns {Function} Express route handler.
 */
module.exports.productMicroNutrients = (store) => (req, res) => {
  const id = req.query['id'];
  store
    .getProductMicroNutrients(id)
    .then((list) => res.json(list))
    .catch((err) => {
      const message = 'Failed to fetch product micro nutrients.';
      console.error(err, message);
      res.status(500).json({message});
    });
};

/**
 * Retrieves a single product micro nutrient by ID.
 * @param {Object} store - Data access object.
 * @returns {Function} Express route handler.
 */
module.exports.productMicroNutrient = (store) => (req, res) => {
  const id = req.query['id'];
  store
    .getProductMicroNutrient(id)
    .then((list) => res.json(list))
    .catch((err) => {
      const message = 'Failed to fetch product micro nutrient.';
      console.error(err, message);
      res.status(500).json({message});
    });
};

/**
 * Returns a paginated list of company rankings.
 * @param {Object} store - Data access object.
 * @returns {Function} Express route handler.
 */
module.exports.rankingList = (store) => async (req, res) => {
  try {
    const {
      query,
    } = req;

    const errors = validate(query, paginationConstraint);

    if (errors) return res.status(400).json({errors});

    const {before, after, 'page-size': size,'cycle-id':cycle_id} = query;

    const data = await store.rankingList(before, after, +size,cycle_id);

    return res.json({
      data,
    });
  } catch (error) {
    const message = 'Failed to fetch company ranking list.';
    console.error(message, error);
    return res.status(500).json({message});
  }
};

/**
 * Retrieves a list of company sizes.
 * @param {Object} store - Data access object.
 * @returns {Function} Express route handler.
 */
module.exports.companySizeList = (store) => (req, res) => {
  store
    .getCompanySizes()
    .then((list) => res.json(list))
    .catch((err) => {
      const message = 'Failed to fetch company size list.';
      console.error(err, message);
      res.status(500).json({message});
    });
};

/**
 * Handles login by sending a verification email with a login token.
 * @param {Object} store - Data access object.
 * @param {Object} transport - Email transport object.
 * @returns {Function} Express route handler.
 */
module.exports.login = (store, transport) => async (req, res) => {
  try {
    const {email} = req.body || {};
    let authUser;

    if (!email) return res.status(400).json({error: 'email required'});

    try {
      authUser = await store.getAuthUserByEmail(email);
      if (!authUser) {
        throw new Error('User not found.');
      }
    } catch (error) {
      console.error('login:error', error.message);
      return res.status(401).json({error: 'Invalid credentials'});
    }

    const token = await signJwtToken(authUser.auth_provider_id);

    // TODO: Put URLs in a constant
    const url = `${process.env.FRONTEND_URL}/verify-token?token=${token}`;
    console.log(('Login URL:'+email+' '), url);
    // Send email in the background.
    sendEmail(transport, {
      from: process.env.TRANSACTIONAL_EMAIL_ADDRESS,
      to: email,
      subject: 'Technoserve MFI Login Details',
      html: `<div><a href="${url}">Click here to Login to Nigeria MFI Portal by TechnoServe:</a> You can also copy and paste the link below:<p>${url}</p</div>`,
    }).catch((err) => console.error(err));

    return res.json({message: 'Login email sent'});
  } catch (err) {
    const msg = 'Some error occured.';

    console.error(msg, err);
    return res.status(500).json({msg});
  }
};

/**
 *
 * @deprecated
 * @param {*} firestore
 * @param {*} auth
 * @returns
 */
module.exports.viewTeamMembers = (firestore, auth) => async (req, res) => {
  try {
    // we need to verify that the userID is linked with an account on the
    // firebase admin
    const db = firestore();
    const {companyId} = req.userDoc;
    const result = [];
    const teamMembersList = await db
      .collection(COLLECTIONS.USERS)
      .where('companyId', '==', companyId)
      .get();

    teamMembersList.forEach(async (doc) => {
      const d = doc.data();
      const userRecord = await auth.getUser(d.id);
      const {fullName, phoneNumber} = userRecord.toJson();
      d.id = doc.id;
      d.fullName = fullName;
      d.phoneNumber = phoneNumber;
      result.push(d);
    });
    return res.json(result);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

/**
 * Get's the current authenticated user data
 *
 * @param {*} db
 * @return {*}
 */

/**
 * Gets the current authenticated user information along with a new JWT token.
 * @param {Object} store - Data access object.
 * @returns {Function} Express route handler.
 */
module.exports.getAuthUserInfo = (store) => async (req, res) => {
  signJwtToken(req.user.auth_provider_id, Date.now() / 1000 + 60 * 60 * 24)
    .then((token) => {
      const user = req.user;
      res.json({user, token});

      // Create activity after response is sent.
      res.on('finish', async () => {
        const companyUser = await store.getCompanyUserByUserId(user.id);

        // We are interested in only a company user's log in activity
        if (!companyUser) return;

        try {
          await new ActivityLog({
            user_id: user.id,
            company_id: companyUser.company_id,
            action: ACTIVITY_LOG_ACTIONS.LOGGED_IN,
          }).save(store);
        } catch (e) {
          console.error('getAuthUserInfo:error', e.message);
        }
      });
    })
    .catch((err) => {
      const message = 'Failed to sign JWT';
      console.error(message, err);
      res.status(500).json({message});
    });
};

/**
 * Fetch the current authenticated user data
 * @returns {Function} Express route handler.
 */
module.exports.getAuthenticatedUser = () => async (req, res) => {
  const user = req.user;
  res.json(user);
};

/**
 * Update the current authenticated user data
 * @param {Object} store - Data access object.
 * @returns {Function} Express route handler.
 */
module.exports.updateAuthenticatedUserData = (store) => async (req, res) => {
  const user = await store.updateUserById(req.user.id, {
    full_name: req.body.full_name,
    email: req.body.email,
  });
  res.json(user);
};

/**
 * Register public user
 * @param {Object} auth - Authentication object.
 * @param {Object} store - Data access object.
 * @returns {Function} Express route handler.
 */
module.exports.registerPublicUser = (auth, store) => async (req, res) => {
  const properties = {
    email: req.body.email,
    displayName: req.body.full_name,
  };

  try {
    const {id: userTypeId} = await store.getUserTypeByName(USER_TYPES.PUBLIC);

    // https://firebase.google.com/docs/auth/admin/manage-users#create_a_user
    const userRecord = await store.createAuthUser(properties.email, properties);

    res.json({
      result: await store.createUser({
        full_name: properties.displayName,
        email: properties.email,
        user_type_id: userTypeId,
        auth_provider_id: userRecord.uid,
      }),
    });
  } catch (error) {
    console.error('Error creating new user:', error);
    let message = 'An error occurred while creating account.';
    if (error && error.errorInfo && error.errorInfo.code === 'auth/email-already-exists') {
      message = 'The email address is already in use by another account.';
    }
    res.status(400).json({message});
  }
};

/**
 * List users belonging to a company
 * @param {Object} store - Data access object.
 * @returns {Function} Express route handler.
 */
module.exports.listCompanyMembers = (store) => async (req, res) => {
  const companyId = req.params.id;

  try {
    const members = await store.getCompanyMembers(companyId);
    return res.json(members);
  } catch (e) {
    console.error('company members error: ', e);
  }

  res.status(500).json({message: 'Request not completed'});
};
