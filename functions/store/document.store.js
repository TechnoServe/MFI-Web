const {docToObject} = require('../utils');
const {firestore} = require('firebase-admin');
const {COLLECTIONS, OWNER_TYPES} = require('../constants');

module.exports.DocumentStore = class DocumentStore {
  /**
   * Documents Constructor
   * @param db
   * @param auth
   */
  constructor(db, auth) {
    this.collection = db.collection(COLLECTIONS.DOCUMENTS);
    this.auth = auth;
  }

  /**
   * Create document record
   * @param user
   * @param (Object) fileAttributes
   */
  create(user, {originalFileName, fileName, owner, storageId, size, contentType, companyId=''}) {
    const docData = {
      storage_id: storageId,
      company_id: user.company_user ? user.company_user.company_id:companyId,
      user_id: user.id,
      owner_type: OWNER_TYPES.CATEGORY,
      owner_id: owner.id,
      size,
      file_name: fileName,
      original_file_name: originalFileName,
      content_type: contentType,
      created_at: firestore.Timestamp.now(),
      updated_at: firestore.Timestamp.now(),
    };
    return this.collection.doc().create(docData);
  }

  /**
   * List documents for category
   * @param companyId
   * @param categoryId
   */
  getDocumentsForCategory(companyId, categoryId, cycleId) {
    return this.list(OWNER_TYPES.CATEGORY, categoryId, companyId, cycleId);
  }

  /**
   * List documents by owner_type
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
   * Get document by id
   * @param user
   * @param id
   */
  async getById(user, id) {
    const docRef = await this.collection.doc(id).get();
    return docRef.exists ? docToObject(docRef) : null;
  }

  /**
   * Remove document
   * @param user
   * @param id
   */
  removeDocument(user, id) {
    return this.collection.doc(id).delete();
  }
};
