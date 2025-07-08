const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require(path.join(__dirname, process.env.AUTH_FILE));

/**
 * Initializes and returns a Firebase Admin instance with credentials and storage bucket configured.
 * Ensures initialization only occurs once.
 *
 * @returns {admin.app.App} Initialized Firebase Admin app instance.
 */
module.exports.getFirebaseAdmin = () => {
  // Initialize the Firebase Admin app only if it hasn't been initialized already
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.PROJECT_ID + '.appspot.com',
    });
  }
  // Return the initialized admin instance
  return admin;
};
