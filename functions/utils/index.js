const jwt = require('jsonwebtoken');
const serviceAccFile = require('../auth-mfi-dev.json');
const validate = require('validate.js');
const {firestore} = require('firebase-admin');
const Busboy = require('busboy');
const {extname, join} = require('path');
const {createWriteStream} = require('fs');
const {tmpdir} = require('os');
const {ADMIN_ROLES} = require('../policies');

/**
 * Custom validator, created off validate js.
 */
module.exports.validate = (() => {
  const validator = validate;

  validate.formatters.grouped = (errs) => {
    const errors = {};

    errs.every((e) => {
      let msg;
      if (e.options && e.options.message) msg = e.options.message;
      else msg = e.error;
      if (errors[e.attribute]) errors[e.attribute].push(msg);
      else errors[e.attribute] = [msg];
    });

    return errors;
  };

  return validator;
})();

/**
 * Sends email using the provided transport.
 *
 * @param {Object} transport
 * @param {Object} params
 * @param {String} params.from sender email
 * @param {String} params.to recipient email
 * @param {String} params.subject subject of email
 * @param {String} params.html html content of email
 * @return {Promise<any>} promise
 */
module.exports.sendEmail = (transport, params = {}) =>
  new Promise((resolve, reject) => {
    if (!transport.sendMail) {
      return reject(new Error('Mail object does not satisfy a `sendMail` interface'));
    }
    transport.sendMail(
      {
        from: params.from,
        to: params.to,
        subject: params.subject,
        html: params.html,
      },
      (err, info) => {
        if (err) return reject(err);
        return resolve(info);
      }
    );
  });

/**
 * Signs JWT token
 *
 * @param {String} uid user's unique id
 * @param {Number} exp the expiry of the signed token
 * @return {Promise<any>} promise
 */
module.exports.signJwtToken = (uid, exp = Math.floor(Date.now() / 1000) + 60 * 60) => {
  const claims = {
    alg: 'HS256',
    iss: serviceAccFile.client_email,
    sub: serviceAccFile.client_email,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    exp, // defaults to 10 minutes
    uid,
  };

  const privateKey = serviceAccFile.private_key;
  const options = {algorithm: 'HS256'};

  return new Promise((resolve, reject) => {
    jwt.sign(claims, privateKey, options, (err, token) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
};

/**
 * Trims and converts email address to lowercase.
 *
 * @param {string} email
 * @returns {string}
 */
module.exports.sanitizeEmailAddress = (email) => email.trim().toLowerCase();

/**
 * Verifies JWT
 *
 * @param {string} token
 * @return {Promise <any>}
 */
module.exports.verifyJwt = (token) =>
  new Promise((resolve, reject) => {
    const options = {algorithm: 'HS256'};

    jwt.verify(token, serviceAccFile.private_key, options, (err, payload) => {
      if (err) return reject(err);
      return resolve(payload);
    });
  });

/**
 * Maps document properties to js object
 *
 * @param {firestore.DocumentSnapshot} doc
 * @returns {Object}
 */
module.exports.docToObject = function (doc) {
  if (!doc.id) {
    console.warn('Doc is empty.');
    return {};
  }
  const data = doc.data();

  const dateFieldNames = ['created_at', 'updated_at', 'deleted_at'];

  // Convert dateFields from firestore Timestamp objects to javascript Date type if defined
  dateFieldNames.forEach((fieldName) => {
    const dateObj = data[fieldName];
    if (dateObj) {
      data[fieldName] = new firestore.Timestamp(dateObj._seconds, dateObj._nanoseconds).toDate();
    }
  });
  return {id: doc.id, ...data};
};

module.exports.paginationConstraint = {
  'page-size': {
    numericality: true,
    presence: {allowEmpty: false},
  },
  'before': {
    type: 'string',
  },
  'after': {
    type: 'string',
  },
};

module.exports.recursiveStringContraints = (...strings) => strings.reduce((accum, str) => ({
  ...accum,
  [str]: {
    type: 'string',
    presence: {allowEmpty: false},
  }
}), {});

module.exports.companyAndCycle = {
  'cycle-id': {
    type: 'string',
  },
  'company-id': {
    type: 'string',
    presence: {allowEmpty: false},
  },
};

/**
 * Handles multipart file upload using Busboy and uploads the file to Firebase Storage.
 *
 * @param {Object} admin - Firebase admin instance.
 * @param {Object} req - Express request object containing rawBody.
 * @param {string|null} fname - Optional custom filename.
 * @param {string|null} filePath - Optional storage destination prefix.
 * @returns {Promise<Object>} Resolves with Firebase Storage metadata.
 */
module.exports.uploadHelper = (admin, req, fname = null, filePath = null) => new Promise((resolve, reject) => {
  const busboy = new Busboy({headers: req.headers});

  let uploadedFileMeta = {};

  // Handle the file upload and determine the filename and path
  // eslint-disable-next-line
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const friendlyFileName = fname ? fname + extname(filename) : filename;

    const filepath = join(tmpdir(), friendlyFileName);
    uploadedFileMeta = {...uploadedFileMeta, friendlyFileName, filepath};
    file.pipe(createWriteStream(filepath));
  });

  // Upload file to Firebase Storage once the upload finishes
  busboy.on('finish', async () => {
    try {
      // eslint-disable-next-line
      const [file, metadata] = await admin.storage().bucket().upload(
        uploadedFileMeta.filepath,
        {
          destination: filePath ? filePath + uploadedFileMeta.friendlyFileName : uploadedFileMeta.friendlyFileName,
        }
      );
      resolve(metadata);
    } catch (e) {
      console.error('Upload failed: ', e);
      reject(e);
    }
  });
  busboy.end(req.rawBody);
});

/**
 * Checks if a user with the given role is allowed to invite another user to a specific role.
 *
 * @param {string} userRole - Role of the current user.
 * @param {string} invitedUserAssignedRole - Role being assigned to the invited user.
 * @returns {boolean} True if invitation is allowed; false otherwise.
 */
module.exports.adminCanInvite = (userRole, invitedUserAssignedRole) => {
  // Validate invite permission based on current user's role
  switch (userRole) {
    case ADMIN_ROLES.NUCLEAR:
      return true;
    case ADMIN_ROLES.SUPER:
      return [ADMIN_ROLES.BASIC, ADMIN_ROLES.SUPER, ADMIN_ROLES.IVC].includes(
        invitedUserAssignedRole
      );
    case ADMIN_ROLES.IVC:
      return ADMIN_ROLES.IVC == invitedUserAssignedRole;
    case ADMIN_ROLES.BASIC:
      return [ADMIN_ROLES.BASIC, ADMIN_ROLES.IVC].includes(invitedUserAssignedRole);
    default:
      return false;
  }
};
