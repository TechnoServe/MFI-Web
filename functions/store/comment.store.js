const {docToObject} = require('../utils');
const {firestore} = require('firebase-admin');
const {COLLECTIONS, OWNER_TYPES} = require('../constants');

module.exports.CommentStore = class CommentStore {
  /**
   * Comments Constructor
   * @param db
   * @param auth
   */
  constructor(db, auth) {
    this.collection = db.collection(COLLECTIONS.COMMENTS);
    this.auth = auth;
  }

  /**
   * Add comment
   * @param user
   * @param content
   * @param owner
   * @param parent
   */
  addComment(user, {cycle, content, owner, parent = '', companyId=''}) {
    const docData = {
      cycle_id:cycle,
      content,
      company_id: user.company_user ? user.company_user.company_id:companyId,
      user_id: user.id,
      parent_id: parent,
      owner_type: OWNER_TYPES.CATEGORY,
      owner_id: owner.id,
      created_at: firestore.Timestamp.now(),
      updated_at: firestore.Timestamp.now(),
    };
    return this.collection.doc().create(docData);
  }

  /**
   * Get comment by id
   * @param id
   */
  getById(id) {
    return this.collection
      .doc(id)
      .get()
      .then((result) => {
        return Promise.resolve(result.exists ? docToObject(result) : null);
      });
  }

  /**
   * List comments by user
   * @param userId
   */
  getCommentsForUser(userId) {
    return this.collection
      .where('user_id', '==', userId)
      .get()
      .then((result) => {
        return Promise.resolve(result.docs.map(docToObject));
      });
  }

  /**
   * List comments for category
   * @param companyId
   * @param categoryId
   */
  getCommentsForCategory(companyId, categoryId, cycleId) {
    // Todo: read optimizations based on UI
    // This may not be convenient for listing multi-level comments
    // as it requires front-end sorting when payload is large
    return this.list(OWNER_TYPES.CATEGORY, categoryId, companyId, cycleId);
  }

  /**
   * List comments by owner_type
   * @param ownerType
   * @param ownerId
   * @param companyId
   */
  list(ownerType, ownerId, companyId, cycleId) {
    if (ownerType !== OWNER_TYPES.CATEGORY) {
      throw Error(`No implementation for ${ownerType} owner type`);
    }
    return this.collection
      //.where('cycle_id', '==', cycleId)
      .where('owner_type', '==', ownerType)
      .where('owner_id', '==', ownerId)
      .where('company_id', '==', companyId)
      .get()
      .then((result) => {
        return Promise.resolve(result.docs.map(docToObject));
      });
  }

  /**
   * Remove comment
   * @param user
   * @param id
   */
  removeComment(user, id) {
    return this.collection.doc(id).delete();
  }
};
