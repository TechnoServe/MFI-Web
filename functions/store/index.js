const {docToObject} = require('../utils');
const {COLLECTIONS, PC_ROLES, USER_TYPES} = require('../constants');
const {firestore} = require('firebase-admin');
const {v4: uuidv4} = require('uuid');
const {CommentStore} = require('./comment.store');
const {DocumentStore} = require('./document.store');
const _ = require('lodash');
const {isCompanyMember, isMFIAdmin} = require('../guards');
const {getFirebaseAdmin} = require('../index.admin');
/* eslint-disable no-async-promise-executor*/

/**
 * Abstracts all calls to the underlaying datastore.
 * @param {FirebaseFirestore.Firestore} db - Firestore database instance.
 * @param {import('firebase-admin').auth.Auth} auth - Firebase Auth instance.
 * @returns {Object} Store object with data access methods.
 */
module.exports = (db, auth) => {
  /**
   * Store object providing various database operations for users, companies, comments, documents, SAT questions, assessment answers, brands, roles, cycles, and more.
   *
   * @namespace store
   * @property {CommentStore} comments - All database operations relating to comments.
   * @property {DocumentStore} documents - All database operations relating to documents.
   * @function getUserByEmail - Retrieves a user by email address.
   * @function getUserByUid - Retrieves a user by Firestore document UID.
   * @function listUsersByUid - Retrieves multiple users by an array of UIDs.
   * @function listCompaniesByUid - Retrieves multiple companies by an array of UIDs.
   * @function getUserByAuthId - Retrieves a user by Firebase Auth provider ID.
   * @function getCompanyRoleByName - Retrieves a company role by its value/name.
   * @function getUserTypeByName - Retrieves a user type by its value/name.
   * @function getUserTypeById - Retrieves a user type by its document ID.
   * @function createUser - Creates a user document.
   * @function createCompanyUser - Creates a company user document.
   * @function addCompanyBrands - Adds new brands to a company.
   * @function updateCompanyBrand - Updates existing company brands.
   * @function deleteCompanyBrands - Deletes specified brands from a company.
   * @function updateSATQestions - Updates SAT questions in batch.
   * @function updateSATQuestionCategory - Updates a SAT question category.
   * @function addSATQestions - Adds a new SAT question.
   * @function deleteSATQestions - Deletes a SAT question by ID.
   * @function createCompanyAndUser - Creates both a company and a user, assigning the user as admin of the company.
   * @function getProductTypes - Retrieves all product types.
   * @function getCompanySizes - Retrieves all company sizes.
   * @function saveActivityLog - Saves an activity log entry.
   * @function getCompanyActivityLogs - Retrieves paginated activity logs for a company.
   * @function getQuestionCategoryById - Retrieves a question category by ID.
   * @function getProductTypeById - Retrieves a product type by ID.
   * @function getTierById - Retrieves a tier by ID.
   * @function getAssessmentAnswers - Returns a function to retrieve assessment answers for a given collection.
   * @function getPreviousAssessmentAnswers - Returns a function to retrieve previous assessment answers for a given collection.
   * @function getSatScores - Retrieves SAT scores for a company and cycle.
   * @function setAssessmentScore - Sets or updates an assessment score.
   * @function getQuestionCategories - Retrieves question categories, optionally filtered by parent IDs or root only.
   * @function getModalCategories - Retrieves modal categories (root categories).
   * @function getAdminUserByUserId - Retrieves an admin user by user ID, including role.
   * @function getCompanyUserByUserId - Retrieves a company user by user ID, including role.
   * @function getCompanyDataUserByUserId - Retrieves a company user by user ID, populating extra data if provided.
   * @function getQuestions - Retrieves questions, optionally filtered by category IDs.
   * @function getProductMicroNutrients - Retrieves product micro nutrients for a product type and optional micro nutrient ID.
   * @function getProductMicroNutrient - Retrieves product micro nutrients for a product type.
   * @function getActiveSATCycle - Retrieves the active SAT cycle, or by ID.
   * @function getCycles - Retrieves all SAT cycles.
   * @function updateOrCreateAssessmentAnswers - Returns a function to update or create assessment answers for a collection.
   * @function getCompanyById - Retrieves a company by ID.
   * @function getBrandById - Retrieves a brand by ID.
   * @function updateCompany - Updates a company by ID.
   * @function assignRole - Assigns a role to an admin user.
   * @function lockSat - Locks a SAT cycle with a lock date.
   * @function updateUserById - Updates a user by ID.
   * @function setCompanyTier - Sets the tier for a company.
   * @function softDeleteCompanyUser - Soft deletes company users by setting deleted_at timestamp.
   * @function createIEGScores - Creates or updates IEG scores in batch.
   * @function createSATScores - Creates or updates SAT scores in batch.
   * @function getAuthUserByEmail - Retrieves a user by email address (for auth).
   * @function getCompanyBrands - Retrieves brands for a company.
   * @function getCompanyBrandsAdmin - Retrieves all brands for a company (admin).
   * @function createAuthUser - Creates an authentication user.
   * @function getCompanies - Retrieves companies, optionally paginated and/or filtered by IDs.
   * @function getCompaniesAdmin - Retrieves all companies for admin, optionally paginated and/or filtered by IDs.
   * @function getIvcCompanies - Retrieves IVC companies assigned to a user.
   * @function approveSAT - Approves all SAT answers for a company and cycle by a user.
   * @function assignCompanyToUser - Assigns a company to a user for a cycle.
   * @function getAssessmentScores - Retrieves assessment scores for a company, cycle, and type.
   * @function getAllAssessmentScores - Retrieves all assessment scores for all companies from Firestore, filtered by cycle and optionally by type.
   */
  const store = {
    // All database operations relating to comments
    comments: new CommentStore(db, auth),
    documents: new DocumentStore(db, auth),

    /**
     * Retrieves a user by email address.
     * @param {string} email - User's email.
     * @returns {Promise<Object|null>} User object or null if not found.
     */
    getUserByEmail: async (email) => {
      try {
        const user = await db
          .collection(COLLECTIONS.USERS)
          .where('email', '==', email)
          .limit(1)
          .get();

        if (user.empty) return null;

        return docToObject(user.docs[0]);
      } catch (e) {
        console.error('Fetch user by email', e);
        return null;
      }
    },

    /**
     * Retrieves a user by Firestore document UID.
     * @param {string} uid - User document ID.
     * @returns {Promise<Object|null>} User object or null if not found.
     */
    getUserByUid: (uid) =>
      new Promise((resolve, reject) => {
        db.collection(COLLECTIONS.USERS)
          .doc(uid)
          .get()
          .then((user) => {
            if (!user.exists) return resolve(null);
            resolve(docToObject(user));
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      }),

    /**
     * Retrieves multiple users by an array of UIDs.
     * @param {string[]} userIds - Array of user document IDs.
     * @returns {Promise<Object[]>} Array of user objects.
     */
    listUsersByUid: (userIds) =>
      new Promise((resolve, reject) => {
        const userRefs = userIds.map((id) => db.collection(COLLECTIONS.USERS).doc(id));
        if (userRefs.length === 0) return resolve([]);
        db.getAll(...userRefs)
          .then((users) => {
            resolve(users.filter((doc) => doc.exists).map((user) => docToObject(user)));
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      }),

    /**
     * Retrieves multiple companies by an array of UIDs.
     * @param {string[]} companyIds - Array of company document IDs.
     * @returns {Promise<Object[]>} Array of company objects.
     */
    listCompaniesByUid: (companyIds) =>
      new Promise((resolve, reject) => {
        const companyRefs = companyIds.map((id) =>
          db.collection(COLLECTIONS.PARTICIPATING_COMPANIES).doc(id)
        );
        if (companyRefs.length === 0) return resolve([]);
        db.getAll(...companyRefs)
          .then((companies) => {
            resolve(companies.map((company) => docToObject(company)));
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      }),

    /**
     * Retrieves a user by Firebase Auth provider ID.
     * @param {string} authId - Auth provider ID.
     * @returns {Promise<Object|null>} User object or null if not found.
     */
    getUserByAuthId: (authId) =>
      new Promise((resolve, reject) => {
        db.collection(COLLECTIONS.USERS)
          .where('auth_provider_id', '==', authId)
          .get()
          .then((user) => {
            if (user.empty) resolve(null);
            else resolve(docToObject(user.docs[0]));
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      }),

    /**
     * Retrieves a company role by its value/name.
     * @param {string} name - Role value.
     * @returns {Promise<Object|null>} Role object or null if not found.
     */
    getCompanyRoleByName: async (name) => {
      try {
        const roleCollection = await db
          .collection(COLLECTIONS.COMPANY_ROLES)
          .where('value', '==', name)
          .limit(1)
          .get();

        if (roleCollection.empty) return null;

        return docToObject(roleCollection.docs[0]);
      } catch (error) {
        console.error('get role by name', error);
        return null;
      }
    },

    /**
     * Retrieves a user type by its value/name.
     * @param {string} name - User type value.
     * @returns {Promise<Object|null>} User type object or null if not found.
     */
    getUserTypeByName: async (name) => {
      try {
        const userTypeCollection = await db
          .collection(COLLECTIONS.USER_TYPES)
          .where('value', '==', name)
          .limit(1)
          .select('id')
          .get();

        if (userTypeCollection.empty) return null;

        return docToObject(userTypeCollection.docs[0]);
      } catch (error) {
        console.error('get user type by name', error);
        return null;
      }
    },

    /**
     * Retrieves a user type by its document ID.
     * @param {string} id - User type document ID.
     * @returns {Promise<Object|null>} User type object or null if not found.
     */
    getUserTypeById: async (id) => {
      try {
        const doc = await db.collection(COLLECTIONS.USER_TYPES).doc(id).get();

        if (!doc.exists) return null;

        return docToObject(doc);
      } catch (error) {
        console.error('get user type by id', error);
        return null;
      }
    },

    /**
     * Creates a user document.
     * @param {Object} data - User data.
     * @returns {Promise<Object>} Created user object.
     */
    createUser: async (data) => {
      const user = await db
        .collection(COLLECTIONS.USERS)
        .add({
          ...data,
          created_at: firestore.FieldValue.serverTimestamp(),
          updated_at: firestore.FieldValue.serverTimestamp(),
        })
        .then((ref) => ref.get());

      return docToObject(user);
    },

    /**
     * Creates a company user document.
     * @param {Object} data - Company user data.
     * @returns {Promise<Object>} Created company user object.
     */
    createCompanyUser: async (data) => {
      const companyUser = await db
        .collection(COLLECTIONS.COMPANY_USERS)
        .add({
          ...data,
          created_at: firestore.FieldValue.serverTimestamp(),
          updated_at: firestore.FieldValue.serverTimestamp(),
        })
        .then((ref) => ref.get());

      return docToObject(companyUser.data());
    },

    /**
     * Adds new brands to a company.
     * @param {string} companyId - Company ID.
     * @param {Object[]} brands - Array of brand objects.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    addCompanyBrands: async (companyId, brands = []) => {
      try {
        const batch = db.batch();

        brands.forEach((brand) => {
          const brandRef = db.collection(COLLECTIONS.COMPANY_BRANDS).doc();
          batch.create(brandRef, {
            ...brand,
            company_id: companyId,
            created_at: firestore.FieldValue.serverTimestamp(),
            updated_at: firestore.FieldValue.serverTimestamp(),
          });
        });

        await batch.commit();

        return true;
      } catch (err) {
        console.error('add company brands', err);
        return false;
      }
    },
    /**
     * Make all company brands active.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    makeAllCompanyBrandsActive: async () => {
      try {
        const brands = await db.collection(COLLECTIONS.COMPANY_BRANDS).get();
        if (brands.empty) return false;

        const batch = db.batch();
        brands.forEach((brand) => {
          batch.update(brand.ref, { active: true });
        });

        await batch.commit();
        return true;
      } catch (err) {
        console.error('make all brands active', err);
        return false;
      }
    },

    /**
     * Updates existing company brands.
     * @param {string} companyId - Company ID.
     * @param {Object[]} brands - Array of brand objects with IDs.
     * @returns {Promise<void>}
     */
    updateCompanyBrand: async (companyId, brands = []) => {
      const batch = db.batch();

      brands.forEach((brand) => {
        const ref = db.collection(COLLECTIONS.COMPANY_BRANDS).doc(brand.id);

        const docIsOk = (async () => {
          const doc = await ref.get();
          if (!doc.exists) return false;
          return doc.data().company_id == companyId;
        })();

        delete brand['id']; // Remove brand ID from the data before updating
        if (docIsOk) {
          batch.update(ref, {
            ...brand,
            updated_at: firestore.FieldValue.serverTimestamp(),
          });
        }
      });

      await batch.commit();
    },

    /**
     * Deletes specified brands from a company.
     * @param {string} companyId - Company ID.
     * @param {string[]} brandsIds - Array of brand IDs.
     * @returns {Promise<void>}
     */
    deleteCompanyBrands: async (companyId, brandsIds = []) => {
      const batch = db.batch();

      brandsIds.forEach((id) => {
        const ref = db.collection(COLLECTIONS.COMPANY_BRANDS).doc(id);

        const docIsOk = (async () => {
          const doc = await ref.get();
          if (!doc.exists) return false;
          return doc.data().company_id == companyId;
        })();

        if (docIsOk) batch.delete(ref);
      });

      await batch.commit();
    },
    /**
     * Updates SAT questions in batch.
     * @param {Object[]} questions - Array of question objects.
     * @returns {Promise<void>}
     */
    updateSATQestions: async (questions = []) => {
      const batch = db.batch();

      questions.forEach((question) => {
        const ref = db.collection(COLLECTIONS.QUESTIONS).doc(question.id);

        delete question['id']; // Remove question ID from the data before updating
        batch.update(ref, {
          ...question
        });
      });

      await batch.commit();
    },

    /**
     * Updates a SAT question category.
     * @param {string} id - Category ID.
     * @param {Object} data - Data to update.
     * @returns {Promise<Object|boolean>} Updated category object or false if not found.
     */
    updateSATQuestionCategory: async (id, data) => {
      try {
        let questionCategory = await db.collection(COLLECTIONS.QUESTION_CATEGORIES).doc(id).get();
        if (!questionCategory.exists) return false;
        await questionCategory.ref.update(data);
        questionCategory = await questionCategory.ref.get(); // Get updated data

        return docToObject(questionCategory);
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    /**
     * Adds a new SAT question.
     * @param {Object} data - Question data.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    addSATQestions: async (data) => {
      try {
        await db.collection(COLLECTIONS.QUESTIONS).add(data);

        return true;
      } catch (err) {
        console.error('add new question', err);
        return false;
      }
    },
    /**
     * Deletes a SAT question by ID.
     * @param {string} id - Question ID.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    deleteSATQestions: async (id) => {
      try {
        await db.collection(COLLECTIONS.QUESTIONS).doc(id).delete();

        return true;
      } catch (err) {
        console.error('add new question', err);
        return false;
      }
    },

    /**
     * Creates both a company and a user, assigning the user as admin of the company.
     * @param {Object} user - User data.
     * @param {Object} company - Company data.
     * @returns {Promise<Object>} Created company user object.
     */
    createCompanyAndUser: (user, company) =>
      new Promise((resolve, reject) => {
        const companyDoc = db.collection(COLLECTIONS.PARTICIPATING_COMPANIES).doc();
        const userDoc = db.collection(COLLECTIONS.USERS).doc();

        // Get IDs user role and user type.
        Promise.all([
          // Get PC user type ID
          db
            .collection(COLLECTIONS.USER_TYPES)
            .where('value', '==', USER_TYPES.PARTICIPATING_COMPANY)
            .limit(1)
            .select('id')
            .get(),

          // Get Company admin role ID
          db
            .collection(COLLECTIONS.COMPANY_ROLES)
            .where('value', '==', PC_ROLES.ADMIN)
            .limit(1)
            .select('id')
            .get(),
        ]).then(([userTypeIds, companyRoleIds]) => {
          // None of the returned data should be empty
          if (userTypeIds.empty || companyRoleIds.empty) {
            const msg = 'Some parameters are empty.';
            console.error(
              msg,
              `userTypeIds: ${userTypeIds.empty}`,
              `companyRoleIds: ${companyRoleIds.empty}`
            );
            return reject(new Error(msg));
          }

          user = {
            ...user,
            user_type_id: userTypeIds.docs[0].id,
            created_at: firestore.FieldValue.serverTimestamp(),
            updated_at: firestore.FieldValue.serverTimestamp(),
          };

          company = {
            ...company,
            created_at: firestore.FieldValue.serverTimestamp(),
            updated_at: firestore.FieldValue.serverTimestamp(),
            active: true,
          };

          const batch = db.batch();

          // Create company and user
          batch.set(companyDoc, company);
          batch.set(userDoc, user);

          // Create company user
          batch
            .commit()
            .then(() => {
              db.collection(COLLECTIONS.COMPANY_USERS)
                .add({
                  user_id: userDoc.id,
                  company_id: companyDoc.id,
                  company_role_id: companyRoleIds.docs[0].id,
                  created_at: firestore.FieldValue.serverTimestamp(),
                  updated_at: firestore.FieldValue.serverTimestamp(),
                })
                .then((ref) => {
                  ref
                    .get()
                    .then((doc) => resolve(docToObject(doc)))
                    .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
        });
      }),

    /**
     * Retrieves all product types.
     * @returns {Promise<Object[]>} Array of product type objects.
     */
    getProductTypes: () =>
      new Promise((resolve, reject) => {
        db.collection(COLLECTIONS.FOOD_VEHICLES)
          .get()
          .then((res) => {
            const data = [];
            res.forEach((doc) => data.push(docToObject(doc)));
            resolve(data);
          })
          .catch((err) => reject(err));
      }),

    /**
     * Retrieves all company sizes.
     * @returns {Promise<Object[]>} Array of company size objects.
     */
    getCompanySizes: () =>
      new Promise((resolve, reject) => {
        db.collection(COLLECTIONS.COMPANY_SIZES)
          .orderBy('order', 'asc')
          .get()
          .then((res) => {
            const data = [];
            res.forEach((doc) => data.push(docToObject(doc)));
            resolve(data);
          })
          .catch((err) => reject(err));
      }),

    /**
     * Saves an activity log entry.
     * @param {Object} activity - Activity log data.
     * @returns {Promise<void>}
     */
    saveActivityLog: async (activity = {}) => {
      activity['created_at'] = firestore.FieldValue.serverTimestamp();
      await db.collection(COLLECTIONS.ACTIVITY_LOGS).add(activity);
    },

    /**
     * getCompanyActivityLogs
     * @param {String} companyId
     * @param {Number|String} page
     * @param {Number|String} perPage
     * @return Promise<Object[]>
     */
    /**
     * Retrieves paginated activity logs for a company.
     * @param {String} companyId - Company ID.
     * @param {Number|String} page - Page number.
     * @param {Number|String} perPage - Items per page.
     * @returns {Promise<Object[]>} Array of activity log entries.
     */
    getCompanyActivityLogs: async (companyId, page, perPage) => {
      const limit = +perPage && +perPage > 0 && +perPage <= 100 ? +perPage : 20;
      const skip = +page ? (+page - 1) * limit : 0;
      const logs = await db
        .collection(COLLECTIONS.ACTIVITY_LOGS)
        .where('company_id', '==', companyId)
        .limit(limit)
        .offset(skip)
        .get();
      if (logs.empty) return [];
      const data = [];
      logs.forEach((log) => data.push(docToObject(log)));
      return data;
    },

    /**
     * Retrieves a question category by ID.
     * @param {string} id - Category ID.
     * @returns {Promise<Object|null>} Category object or null if not found.
     */
    getQuestionCategoryById: async (id) => {
      try {
        const data = await db.collection(COLLECTIONS.QUESTION_CATEGORIES).doc(id).get();

        if (!data.exists) return null;
        return docToObject(data);
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    /**
     * Retrieves a product type by ID.
     * @param {string} id - Product type ID.
     * @returns {Promise<Object|null>} Product type object or null if not found.
     */
    getProductTypeById: async (id) => {
      try {
        const data = await db.collection(COLLECTIONS.FOOD_VEHICLES).doc(id).get();

        if (!data.exists) return null;
        return docToObject(data);
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    /**
     * Retrieves a tier by ID.
     * @param {string} id - Tier ID.
     * @returns {Promise<Object|null>} Tier object or null if not found.
     */
    getTierById: async (id) => {
      try {
        const data = await db.collection(COLLECTIONS.QUESTION_TIERS).doc(id).get();

        if (!data.exists) return null;
        return docToObject(data);
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    /**
     * Returns a function to retrieve assessment answers for a given collection.
     * @param {string} collection - Firestore collection name.
     * @returns {Function} Function to get answers for company/category/cycle.
     */
    getAssessmentAnswers: (collection) => async (companyId, categoryIds = [], cycleId = null, showUnapproved = false) => {
      try {
        let query = db.collection(collection).where('company_id', '==', companyId);

        if (categoryIds.length) query = query.where('category_id', 'in', categoryIds);
        if (cycleId) query = query.where('cycle_id', '==', cycleId);
        if (collection === COLLECTIONS.SA_ANSWERS) {
          if (!showUnapproved) query = query.where('approved', '==', true);
        }
        query = query.orderBy('updated_at');

        const data = await query.get();

        if (data.empty) return [];

        return data.docs.map((doc) => docToObject(doc));
      } catch (err) {
        console.error('store get SAT answers', err);
        return [];
      }
    },
    /**
     * Returns a function to retrieve previous assessment answers for a given collection.
     * @param {string} collection - Firestore collection name.
     * @returns {Function} Function to get previous answers for company/category.
     */
    getPreviousAssessmentAnswers: (collection) => async (companyId, categoryIds = [], showUnapproved = false) => {
      try {
        let query = db.collection(collection).where('company_id', '==', companyId);
        let previousCycle = await db.collection(COLLECTIONS.SA_CYCLES).where('previous', '==', true).get();
        if (previousCycle.empty) return [];

        previousCycle = docToObject(previousCycle.docs[0]);
        console.log("previousCycle", previousCycle);
        query = query.where('cycle_id', '==', previousCycle.id);
        
        if (categoryIds.length) query = query.where('category_id', 'in', categoryIds);
        if (collection === COLLECTIONS.SA_ANSWERS) {
          if (!showUnapproved) query = query.where('approved', '==', true);
        }
        query = query.orderBy('updated_at');

        const data = await query.get();

        if (data.empty) return [];

        return data.docs.map((doc) => docToObject(doc));
      } catch (err) {
        console.error('store get SAT answers', err);
        return [];
      }
    },

    /**
     * Retrieves SAT scores for a company and cycle.
     * @param {string} companyId - Company ID.
     * @param {string} cycleId - Cycle ID.
     * @returns {Promise<Object[]>} Array of score objects.
     */
    getSatScores: async (companyId, cycleId) => {
      let query = db
        .collection(COLLECTIONS.COMPUTED_ASSESSMENT_SCORES)
        .where('company_id', '==', companyId);
      query = query.where('cycle_id', '==', cycleId);

      const data = await query.get();

      if (data.empty) return [];

      return data.docs.map((doc) => docToObject(doc));
    },

    /**
     * Sets or updates an assessment score.
     * @param {string} companyId - Company ID.
     * @param {string} cycleId - Cycle ID.
     * @param {string} type - Score type.
     * @param {number} value - Score value.
     * @returns {Promise<void>}
     */
    setAssessmentScore: async (companyId, cycleId, type, value) => {
      console.log('setAssessmentScore', companyId, cycleId, type, value);
      let query = db
        .collection(COLLECTIONS.COMPUTED_ASSESSMENT_SCORES)
        .where('company_id', '==', companyId);
      query = query.where('cycle_id', '==', cycleId);
      query = query.where('score_type', '==', type);

      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
        await db.collection(COLLECTIONS.COMPUTED_ASSESSMENT_SCORES).add({
          company_id: companyId,
          score_type: type,
          cycle_id: cycleId,
          value,
        });
      } else {
        const doc = querySnapshot.docs[0];

        await doc.ref.update({
          ...doc.data(),
          value,
          updated_at: firestore.FieldValue.serverTimestamp(),
        });
      }
    },

    /**
     * Retrieves question categories, optionally filtered by parent IDs or root only.
     * @param {string[]} parentIds - Parent category IDs.
     * @param {boolean} rootOnly - Whether to return only root categories.
     * @returns {Promise<Object[]|null>} Array of category objects or null.
     */
    getQuestionCategories: async (parentIds = [], rootOnly = false) => {
      try {
        const data = [];
        let query = db.collection(COLLECTIONS.QUESTION_CATEGORIES).orderBy('sort_order', 'asc');

        if (!rootOnly && parentIds && parentIds.length) {
          query = query.where('parent_id', 'in', parentIds);
        }

        const categories = await query.get();

        if (!categories.empty) categories.forEach((category) => data.push(docToObject(category)));

        return rootOnly
          ? data.filter((cat) => !cat.parent_id || (cat.parent_id && !cat.parent_id.length))
          : data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    /**
     * Retrieves modal categories (root categories).
     * @returns {Promise<Object[]|null>} Array of modal categories or null.
     */
    getModalCategories: async () => {
      try {
        const data = [];
        let query = db.collection(COLLECTIONS.QUESTION_CATEGORIES).where('parent_id', '==', '');
        query = query.orderBy('sort_order', 'asc');

        const categories = await query.get();

        if (!categories.empty) categories.forEach((category) => data.push(docToObject(category)));

        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    /**
     * Retrieves an admin user by user ID, including role.
     * @param {string} userId - User ID.
     * @returns {Promise<Object|null>} Admin user object or null.
     */
    getAdminUserByUserId: async (userId) => {
      try {
        let adminUser = await db
          .collection(COLLECTIONS.ADMIN_USERS)
          .where('user_id', '==', userId)
          .get();

        if (adminUser.empty) return null;
        adminUser = docToObject(adminUser.docs[0]);

        let role = await db
          .collection(COLLECTIONS.ADMIN_ROLES)
          .where('__name__', '==', adminUser.admin_role_id)
          .get();

        if (role.empty) return adminUser;
        role = docToObject(role.docs[0]);

        adminUser.role = role;
        return adminUser;
      } catch (err) {
        console.error('store.getAdminUserByUserId', err);
        return null;
      }
    },

    /**
     * Retrieves a company user by user ID, including role.
     * @param {string} userId - User ID.
     * @returns {Promise<Object|null>} Company user object or null.
     */
    getCompanyUserByUserId: async (userId) => {
      try {
        let companyUser = await db
          .collection(COLLECTIONS.COMPANY_USERS)
          .where('user_id', '==', userId)
          .get();
        if (companyUser.empty) return null;
        companyUser = docToObject(companyUser.docs[0]);

        let role = await db
          .collection(COLLECTIONS.COMPANY_ROLES)
          .where(firestore.FieldPath.documentId(), '==', companyUser.company_role_id)
          .get();

        if (role.empty) return companyUser;
        role = docToObject(role.docs[0]);

        companyUser.role = role;
        return companyUser;
      } catch (err) {
        console.error('store.getCompanyUserByUserId', err);
        return null;
      }
    },

    /**
     * Retrieves a company user by user ID, populating extra data if provided.
     * @param {string} userId - User ID.
     * @param {Object|null} data - Optional extra data to merge.
     * @returns {Promise<Object|null>} Company user object or null.
     */
    getCompanyDataUserByUserId: async (userId,data = null) => {
      try {
        let tdr = data;
        tdr.user_id = userId;
        
        let companyUser = await db
          .collection(COLLECTIONS.COMPANY_USERS)
          .where('user_id', '==', userId)
          .get();
        if (companyUser.empty) return tdr;
        companyUser = docToObject(companyUser.docs[0]);

        let role = await db
          .collection(COLLECTIONS.COMPANY_ROLES)
          .where(firestore.FieldPath.documentId(), '==', companyUser.company_role_id)
          .get();
        if (role.empty) return companyUser;
        role = docToObject(role.docs[0]);
        companyUser.role = role;

        if(data){
          let company = await db
          .collection(COLLECTIONS.PARTICIPATING_COMPANIES)
          .where(firestore.FieldPath.documentId(), '==', companyUser.company_id)
          .get();

          if (!company.empty){
            company = docToObject(company.docs[0]);
          } 
          
          companyUser.company_name = company.company_name;
          companyUser.email = data.email;
          companyUser.full_name = data.full_name;
          companyUser.auth_provider_id = data.auth_provider_id;
        }

        return companyUser;
      } catch (err) {
        console.error('store.getCompanyUserByUserId', err);
        return null;
      }
    },

    /**
     * Retrieves questions, optionally filtered by category IDs.
     * @param {string[]} categoryIds - Array of category IDs.
     * @returns {Promise<Object[]|null>} Array of questions or null.
     */
    getQuestions: async (categoryIds = []) => {
      try {
        const data = [];
        let query = db.collection(COLLECTIONS.QUESTIONS).orderBy('sort_order', 'asc');
        if (categoryIds.length) query = query.where('category_id', 'in', categoryIds);
        const categories = await query.get();

        if (!categories.empty) categories.forEach((category) => data.push(docToObject(category)));

        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    /**
     * Retrieves product micro nutrients for a product type and optional micro nutrient ID.
     * @param {string} productTypeId - Product type ID.
     * @param {string|null} microNutrientId - Optional micro nutrient ID.
     * @returns {Promise<Object|Object[]>} Micro nutrient(s) object or array.
     */
    getProductMicroNutrients: async (productTypeId, microNutrientId = null) =>
      await new Promise(async (resolve, reject) => {
        try {
          let query = db
            .collection(COLLECTIONS.PRODUCT_MICRO_NUTRIENTS)
            .where('product_type_id', '==', productTypeId);

          if (microNutrientId) query = query.where('__name__', '==', microNutrientId);

          query = await query.select('micro_nutrient_id').get();

          const refs = query.docs.map((doc) =>
            db.collection(COLLECTIONS.MICRO_NUTRIENTS).doc(doc.data().micro_nutrient_id)
          );
          if (refs.length === 0) return resolve([]);
          const microNutrients = await db.getAll(...refs);

          const data = microNutrients.map((microNutrient) => docToObject(microNutrient));

          resolve(data.length > 1 ? data : data[0]);
        } catch (error) {
          console.error(error);
          reject(error);
        }
      }),
      /**
       * Retrieves product micro nutrients for a product type.
       * @param {string} productTypeId - Product type ID.
       * @returns {Promise<Object[]>} Array of product micro nutrient objects.
       */
      getProductMicroNutrient: async (productTypeId) => {
        const query = db
          .collection(COLLECTIONS.PRODUCT_MICRO_NUTRIENTS)
          .where('product_type_id', '==', productTypeId);
        const data = await query.get();

        if (data.empty) return [];

        return data.docs.map((doc) => docToObject(doc));
      },

    /**
     * Retrieves the active SAT cycle, or by ID.
     * @param {string|null} id - Optional cycle ID.
     * @returns {Promise<Object|null>} Cycle object or null.
     */
    getActiveSATCycle: async (id = null) => {
      const cycleCollection = db.collection(COLLECTIONS.SA_CYCLES);
      let cycle;
      if (id) {
        cycle = cycleCollection.where('__name__', '==', id);
      } else {
        //cycle = cycleCollection.where('active', '==', true).where('end_date', '>=', firestore.Timestamp.fromDate(new Date()));
        cycle = cycleCollection.where('active', '==', true);
      }

      cycle = await cycle.get();

      if (cycle.empty) return null;

      return docToObject(cycle.docs[0]);
    },
    /**
     * Retrieves all SAT cycles.
     * @returns {Promise<Object[]|null>} Array of cycle objects or null.
     */
    getCycles: async () => {
      try {
        const data = [];
        let query = db.collection(COLLECTIONS.SA_CYCLES).orderBy('start_date', 'asc');
        const cycles = await query.get();

        if (!cycles.empty) cycles.forEach((cycle) => data.push(docToObject(cycle)));

        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    /**
     * Returns a function to update or create assessment answers for a collection.
     * @param {string} collection - Firestore collection name.
     * @param {Object} that - Store object for context.
     * @returns {Function} Function to update or create answers.
     */
    updateOrCreateAssessmentAnswers: (collection, that) => async (
      userId,
      companyId,
      categoryId,
      tier,
      response,
      points,
    ) => {
      try {
        // Check if an answer exists.
        const {id: cycleId} = await that.getActiveSATCycle();
        let query = db.collection(collection).where('category_id', '==', categoryId);
        query = query.where('company_id', '==', companyId);
        query = query.where('cycle_id', '==', cycleId);
        query = query.where('tier', '==', tier);

        const approved = collection === COLLECTIONS.SA_ANSWERS ? {approved: false} : {};

        const existingAnswer = await query.get();

        // If answer already exists for the specific question, update it.
        if (!existingAnswer.empty) {
          const doc = existingAnswer.docs[0];

          await doc.ref.update({
            ...doc.data(),
            value: response,
            points,
            ...approved,
            submitted_by: userId,
            updated_at: firestore.FieldValue.serverTimestamp(),
          });
        } else {
          // Create a new answer.
          await db.collection(collection).add({
            submitted_by: userId,
            category_id: categoryId,
            company_id: companyId,
            tier,
            value: response,
            points,
            ...approved,
            cycle_id: cycleId,
            created_at: firestore.FieldValue.serverTimestamp(),
            updated_at: firestore.FieldValue.serverTimestamp(),
          });
        }

        return true;
      } catch (err) {
        console.error('Failed to store SAT response', err);
        return false;
      }
    },

    /**
     * Retrieves a company by ID.
     * @param {string} id - Company ID.
     * @returns {Promise<Object|null>} Company object or null.
     */
    getCompanyById: async (id) => {
      try {
        const company = await db.collection(COLLECTIONS.PARTICIPATING_COMPANIES).doc(id).get();
        if (!company.exists) return null;
        return docToObject(company);
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    /**
     * Retrieves a brand by ID.
     * @param {string} id - Brand ID.
     * @returns {Promise<Object|null>} Brand object or null.
     */
    getBrandById: async (id) => {
      try {
        const brand = await db.collection(COLLECTIONS.COMPANY_BRANDS).doc(id).get();
        if (!brand.exists) return null;
        return docToObject(brand);
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    /**
     * Updates a company by ID.
     * @param {string} id - Company ID.
     * @param {Object} data - Data to update.
     * @returns {Promise<Object|boolean>} Updated company object or false.
     */
    updateCompany: async (id, data) => {
      try {
        let company = await db.collection(COLLECTIONS.PARTICIPATING_COMPANIES).doc(id).get();
        if (!company.exists) return false;
        await company.ref.update(data);
        company = await company.ref.get(); // Get updated data

        return docToObject(company);
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    /**
     * Assigns a role to an admin user.
     * @param {string} userId - User ID.
     * @param {string} roleId - Role ID.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    assignRole: async (userId, roleId) => {
      try {
        const user = await db.collection(COLLECTIONS.ADMIN_USERS).where('user_id', '==', userId).get();

        if (user.empty) return false;

        const adminUser = await db.collection(COLLECTIONS.ADMIN_USERS).doc(user.docs[0].id).get();

        await adminUser.ref.update({admin_role_id: roleId});
        return true;
      } catch (err) {
        console.error(err);
      }
    },

    /**
     * Locks a SAT cycle with a lock date.
     * @param {string} cycleId - Cycle ID.
     * @param {Date|string} date - Lock date.
     * @returns {Promise<void>}
     */
    lockSat: async (cycleId, date) => {
      try {
        const cycle = await db.collection(COLLECTIONS.SA_CYCLES).doc(cycleId).get();
        if (!cycle.exists) return false;
        await cycle.ref.update({sat_lock_date: firestore.Timestamp.fromDate(new Date(date))});
      } catch (err) {
        console.error(err);
      }
    },

    /**
     * Updates a user by ID.
     * @param {string} id - User ID.
     * @param {Object} data - Data to update.
     * @returns {Promise<Object|boolean>} Updated user object or false.
     */
    updateUserById: async (id, data) => {
      try {
        let documentSnapshot = await db.collection(COLLECTIONS.USERS).doc(id).get();
        if (!documentSnapshot.exists) return false;
        await documentSnapshot.ref.update(data);
        documentSnapshot = await documentSnapshot.ref.get();
        return docToObject(documentSnapshot);
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    /**
     * Sets the tier for a company.
     * @param {string} companyId - Company ID.
     * @param {string} tier - Tier value.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    setCompanyTier: async (companyId, tier) => {
      try {
        const ref = db.collection(COLLECTIONS.PARTICIPATING_COMPANIES).doc(companyId);

        if (!(await ref.get()).exists) return false;
        await ref.update({tier});

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    /**
     * Soft deletes company users by setting deleted_at timestamp.
     * @param {string} companyId - Company ID.
     * @param {string[]} userIds - Array of user IDs.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    softDeleteCompanyUser: async (companyId, userIds) => {
      try {
        const snapshot = await db
          .collection(COLLECTIONS.COMPANY_USERS)
          .where('company_id', '==', companyId)
          .where(firestore.FieldPath.documentId(), 'in', userIds)
          .get();

        if (!snapshot.empty) {
          const batch = db.batch();
          snapshot.forEach((doc) =>
            batch.set(doc.ref, {deleted_at: firestore.FieldValue.serverTimestamp()})
          );
          await batch.commit();
        }

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    /**
     * Creates or updates IEG scores in batch.
     * @param {Object[]} scores - Array of score objects.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    createIEGScores: async (scores) => {
      try {
        const upsertCurry = upsertAssessmentScore(db);
        const batchSores = scores.map(upsertCurry);

        await Promise.all(batchSores);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    createSATScores: async (scores, type, companyId, cycleId) => {
      try {
        const upsertCurry = upsertSATAssessmentScore(db, type, companyId, cycleId);
        const batchSores = scores.map(upsertCurry);

        await Promise.all(batchSores);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    // Auth methods
    /**
     * Retrieves a user by email address (for auth).
     * @param {string} email - User email.
     * @returns {Promise<Object|null>} User object or null.
     */
    getAuthUserByEmail: async (email) => {
      try {
        const documentSnapshot = await db
          .collection(COLLECTIONS.USERS)
          .where('email', '==', email)
          .get();
        if (documentSnapshot.empty) return false;

        return docToObject(documentSnapshot.docs[0]);
      } catch (err) {
        const message = 'Failed to find auth user by email.';
        console.error(message, err);

        return null;
      }
    },

    /**
     * Retrieves active brands for a company.
     * @param {string} companyId - Company ID.
     * @returns {Promise<Object[]>} Array of brand objects.
     */
    getCompanyBrands: async (companyId) => {
      const query = db.collection(COLLECTIONS.COMPANY_BRANDS).where('company_id', '==', companyId).where('active', '==', true);
      const data = await query.get();

      if (data.empty) return [];

      return data.docs.map((doc) => docToObject(doc));
    },
    /**
     * Retrieves brands for a company.
     * @param {string} companyId - Company ID.
     * @returns {Promise<Object[]>} Array of brand objects.
     */
    getCompanyBrandsAdmin: async (companyId) => {
      const query = db.collection(COLLECTIONS.COMPANY_BRANDS).where('company_id', '==', companyId);
      const data = await query.get();

      if (data.empty) return [];

      return data.docs.map((doc) => docToObject(doc));
    },

    /**
     * Creates an authentication user.
     * @param {string} email - User email.
     * @param {Object} [properties] - Optional properties (displayName).
     * @returns {Promise<Object>} Created Firebase user object.
     */
    createAuthUser: async (email, properties = {displayName: undefined}) => {
      const user = await auth.createUser({email, displayName: properties.displayName});
      return user.toJSON();
    },

    /**
     * Retrieves companies, optionally paginated and/or filtered by IDs.
     * @param {string|null} before - Document ID to start before.
     * @param {string|null} after - Document ID to start after.
     * @param {number} size - Page size.
     * @param {string[]} ids - Optional array of company IDs.
     * @returns {Promise<Object[]>} Array of company objects.
     */
    getCompanies: async (before, after, size = 15, ids = []) => {
      const query = db.collection(COLLECTIONS.PARTICIPATING_COMPANIES).where('active', '==', true).orderBy('company_name');

      if (ids.length) {
        query.where(firestore.FieldPath.documentId(), 'in', ids);
      }

      const snapshot = await paginateQuery({
        query,
        before,
        after,
        size,
        collection: COLLECTIONS.PARTICIPATING_COMPANIES,
      });

      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) => docToObject(doc));
    },
    /**
     * Retrieves all companies for admin, optionally paginated and/or filtered by IDs.
     * @param {string|null} before - Document ID to start before.
     * @param {string|null} after - Document ID to start after.
     * @param {number} size - Page size.
     * @param {string[]} ids - Optional array of company IDs.
     * @returns {Promise<Object[]>} Array of company objects.
     */
    getCompaniesAdmin: async (before, after, size = 15, ids = []) => {
      const query = db.collection(COLLECTIONS.PARTICIPATING_COMPANIES).orderBy('company_name');

      if (ids.length) {
        query.where(firestore.FieldPath.documentId(), 'in', ids);
      }

      const snapshot = await paginateQuery({
        query,
        before,
        after,
        size,
        collection: COLLECTIONS.PARTICIPATING_COMPANIES,
      });

      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) => docToObject(doc));
    },

    /**
     * Retrieves IVC companies assigned to a user.
     * @param {string} userId - User ID.
     * @returns {Promise<Object[]>} Array of company objects.
     */
    getIvcCompanies: async (userId) => {
      const query = db.collection(COLLECTIONS.ALLOTATIONS).where('user_id', '==', userId);
      const snapshot = await query.get();

      if (snapshot.empty) return [];

      return snapshot.docs.map(async (doc) => await this.getCompanyById(doc.company_id));
    },

    /**
     * Approves all SAT answers for a company and cycle by a user.
     * @param {string} companyId - Company ID.
     * @param {string} cycleId - Cycle ID.
     * @param {string} userId - User ID.
     * @returns {Promise<void>}
     */
    approveSAT: async (companyId, cycleId, userId) => {
      const batch = db.batch();

      const query = db
        .collection(COLLECTIONS.SA_ANSWERS)
        .where('company_id', '==', companyId)
        .where('cycle_id', '==', cycleId)
        .where('approved', '==', false);
      const data = await query.get();

      if (data.empty) throw new Error('No record to approve.');

      data.forEach((doc) => {
        batch.update(doc.ref, {
          approved: true,
          approved_by: userId,
          updated_at: firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
    },

    /**
     * Assigns a company to a user for a cycle.
     * @param {string} companyId - Company ID.
     * @param {string} userId - User ID.
     * @param {string} cycleId - Cycle ID.
     * @returns {Promise<void>}
     */
    assignCompanyToUser: async (companyId, userId, cycleId) => {
      const user = await store.getAdminUserByUserId(userId);

      if (!user) throw new Error('User does not exist.');

      const allotations = await db.collection(COLLECTIONS.ALLOTATIONS).where('user_id', '==', userId).select('company_id').get();

      if (!allotations.empty) {
        const companyIds = allotations.docs.map((doc) => doc.data().company_id);

        if (companyIds.includes(companyId)) throw new Error('Company already assigned to user.');
      }

      const data = {company_id: companyId, user_id: userId, cycle_id: cycleId, created_at: firestore.FieldValue.serverTimestamp()};
      await db.collection(COLLECTIONS.ALLOTATIONS).add(data);
    },

    /**
     * Retrieves assessment scores for a company, cycle, and type.
     * @param {Object} params - Parameters object.
     * @param {string} params.companyId - Company ID.
     * @param {string} params.cycleId - Cycle ID.
     * @param {string} params.type - Assessment type.
     * @returns {Promise<Object[]>} Array of assessment score objects.
     */
    getAssessmentScores: async ({companyId, cycleId, type}) => {
      const query = db
        .collection(COLLECTIONS.ASSESSMENT_SCORES)
        .where('company_id', '==', companyId)
        .where('cycle_id', '==', cycleId)
        .where('type', '==', type);

      const data = await query.get();

      if (data.empty) return [];

      return data.docs.map(docToObject);
    },
    /**
     * Retrieves all assessment scores for all companies from Firestore,
     * filtered by cycle and optionally by type, with optional company info.
     * 
     * @param {string} cycle - The assessment cycle ID (required).
     * @param {string} [type] - Optional type to filter by (e.g., 'validated' or 'selfReported').
     * @param {boolean} [includeCompany=true] - Whether to include company info.
     * @returns {Promise<Array<Object>>} Array of score records.
     */
    getAllAssessmentScores: async (cycle, type, includeCompany = true) => {
      let query = db.collection(COLLECTIONS.ASSESSMENT_SCORES).where('cycle_id', '==', cycle);

      if (type) {
        query = query.where('type', '==', type);
      }

      const snapshot = await query.get();
      const rows = snapshot.docs.map(docToObject);

      if (!includeCompany || rows.length === 0) return rows;

      const companyIds = Array.from(new Set(rows.map((r) => r.company_id).filter(Boolean)));
      const companies = await Promise.all(companyIds.map((id) => store.getCompanyById(id)));
      const companiesById = companies.reduce((acc, c) => {
        if (c && c.id) acc[c.id] = c;
        return acc;
      }, {});

      return rows.map((r) => {
        const c = companiesById[r.company_id];
        return {
          ...r,
          company_name: c?.company_name || null,
          tier: c?.tier || null,
          company_size: c?.company_size || null,
          active: c?.active ?? null
        };
      });
    }
    ,
    /**
     * Computes SAT variance per company for a cycle.
     * Aggregates scores from ASSESSMENT_SCORES by company and type, then
     * returns Self-Assessed (SAT) total, Validated (IVC) total, and variance.
     *
     * @param {string} cycleId - Cycle ID to compute variance for.
     * @returns {Promise<Array<Object>>} Array of records: {
     *   company_id, company_name, tier, company_size, selfScore, validatedScore,
     *   variance, variancePct
     * }
     */
    getSATVarianceByCompany: async (cycleId) => {
      // Pull all assessment scores (all types) and enrich with company info
      const rows = (await store.getAllAssessmentScores(cycleId, null, true))
        .filter(r => r.active === true);

      if (!rows || rows.length === 0) return [];

      const byCompany = _.groupBy(rows, 'company_id');

      const pickNumber = (x) => {
        const n = typeof x === 'number' ? x : Number(x);
        return Number.isFinite(n) ? n : 0;
      };

      const isSAT = (t = '') => {
        const val = String(t).toUpperCase();
        return val === 'SAT' || val === 'SA' || val === 'SELF' || val === 'SELF_REPORTED';
      };

      const isIVC = (t = '') => {
        const val = String(t).toUpperCase();
        return val === 'IVC' || val === 'VALIDATED';
      };

      return Object.entries(byCompany).map(([company_id, items]) => {
        const company_name = items[0]?.company_name || null;
        const tier = items[0]?.tier || null;
        const company_size = items[0]?.company_size || null;

        const satTotal = items
          .filter((r) => isSAT(r.type))
          .reduce((s, r) => s + pickNumber(r.score ?? r.value), 0);

        const ivcTotal = items
          .filter((r) => isIVC(r.type))
          .reduce((s, r) => s + pickNumber(r.score ?? r.value), 0);

        const variance = Math.abs(satTotal - ivcTotal);
        const variancePct = ivcTotal > 0 ? (variance / ivcTotal) * 100 : null;

        return {
          company_id,
          company_name,
          tier,
          company_size,
          selfScore: satTotal,
          validatedScore: ivcTotal,
          variance,
          variancePct,
        };
      });
    },
      /**
 * Builds 4PG table rows for all active companies for a given cycle.
 * Output columns (exact order):
 * Company Name, TIER, Validated Scores (%),
 * IVC Personnel (%), IVC Production (%), IVC Procurement and Suppliers (%),
 * IVC Public Engagement (%), IVC Governance (%),
 * Industry Expert Group (%),
 * IEG Personnel (%), IEG Production (%), IEG Procurement and Suppliers (%),
 * IEG Public Engagement, IEG Governance,
 * Average Personnel (%), Average Production (%),
 * Average Procurement and Suppliers (%), Average Public Engagement (%),
 * Average Governance (%), Average 4PG
 */
  getAll4PGRanking: async (cycleId) => {
    if (!cycleId) return [];

    const companies = await store.getCompanies(null, null, 500);
    if (!companies || companies.length === 0) return [];

    const toNum = (x) => {
      const n = typeof x === 'number' ? x : Number(x);
      return Number.isFinite(n) ? n : 0;
    };

    const pillarKeys = [
      'Personnel',
      'Production',
      'Procurement and Suppliers',
      'Public Engagement',
      'Governance',
    ];

    const detectPillarFromText = (text) => {
      const t = String(text || '').toLowerCase();
      if (!t) return null;
      if (t.includes('personnel')) return 'Personnel';
      if (t.includes('production')) return 'Production';
      if (t.includes('procurement')) return 'Procurement and Suppliers';
      if (t.includes('supplier')) return 'Procurement and Suppliers';
      if (t.includes('public engagement')) return 'Public Engagement';
      if (t.includes('governance')) return 'Governance';
      return null;
    };

    const avg = (arr) => {
      const vals = arr.map(toNum).filter((n) => Number.isFinite(n));
      if (!vals.length) return null;
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };

    const resultRows = await Promise.all(
      companies
        .filter((c) => c?.active === true)
        .map(async (c) => {
          const [iegScores, ivcScores] = await Promise.all([
            store.getAssessmentScores({ companyId: c.id, cycleId, type: 'IEG' }),
            store.getAssessmentScores({ companyId: c.id, cycleId, type: 'IVC' }),
          ]);

          // Build a lookup of QUESTION_CATEGORIES for all category_ids used in IEG + IVC
          const catIds = Array.from(
            new Set([
              ...((Array.isArray(iegScores) ? iegScores : []).map((r) => r.category_id).filter(Boolean)),
              ...((Array.isArray(ivcScores) ? ivcScores : []).map((r) => r.category_id).filter(Boolean)),
            ])
          );
          const catObjs = (catIds.length ? await store.getQuestionCategoriesByIds(catIds) : []) || [];
          const catById = catObjs.reduce((acc, cat) => {
            if (cat && cat.id) acc[cat.id] = cat;
            return acc;
          }, {});

          const detectPillar = (rec) => {
            // 1) Try inline text fields first (if any)
            const inlineText = [rec.pillar, rec.component, rec.area, rec.category, rec.category_name, rec.section, rec.title]
              .filter(Boolean)
              .map(String)
              .join(' | ');
            let pillar = detectPillarFromText(inlineText);
            if (pillar) return pillar;

            // 2) Fall back to QUESTION_CATEGORIES lookup using category_id
            const cat = rec && rec.category_id ? catById[rec.category_id] : null;
            if (cat) {
              // Try common name fields on the category object
              const nameText = [cat.name, cat.title, cat.label, cat.category_name]
                .filter(Boolean)
                .map(String)
                .join(' | ');
              pillar = detectPillarFromText(nameText);
              if (pillar) return pillar;
            }

            return null;
          };

          const iegOverall = avg((Array.isArray(iegScores) ? iegScores : []).map((r) => toNum(r.score ?? r.value)));
          const ivcOverall = avg((Array.isArray(ivcScores) ? ivcScores : []).map((r) => toNum(r.score ?? r.value)));

          // Initialize per-pillar buckets
          const buckets = {
            IVC: {
              'Personnel': [],
              'Production': [],
              'Procurement and Suppliers': [],
              'Public Engagement': [],
              'Governance': [],
            },
            IEG: {
              'Personnel': [],
              'Production': [],
              'Procurement and Suppliers': [],
              'Public Engagement': [],
              'Governance': [],
            },
          };

          (Array.isArray(ivcScores) ? ivcScores : []).forEach((rec) => {
            const key = detectPillar(rec);
            if (key && buckets.IVC[key]) buckets.IVC[key].push(toNum(rec.score ?? rec.value));
          });

          (Array.isArray(iegScores) ? iegScores : []).forEach((rec) => {
            const key = detectPillar(rec);
            if (key && buckets.IEG[key]) buckets.IEG[key].push(toNum(rec.score ?? rec.value));
          });

          const ivcPillar = Object.fromEntries(
            pillarKeys.map((k) => [k, avg(buckets.IVC[k])])
          );
          const iegPillar = Object.fromEntries(
            pillarKeys.map((k) => [k, avg(buckets.IEG[k])])
          );
          // Compute sum of IVC pillar averages
          const ivcSum = pillarKeys.reduce((sum, k) => sum + toNum(ivcPillar[k] ?? 0), 0);
          // Compute sum of IEG pillar averages
          const iegSum = pillarKeys.reduce((sum, k) => sum + toNum(iegPillar[k] ?? 0), 0);

          const avgPersonnel = avg([ivcPillar['Personnel'], iegPillar['Personnel']].filter((v) => v != null));
          const avgProduction = avg([ivcPillar['Production'], iegPillar['Production']].filter((v) => v != null));
          const avgProcSup = avg([ivcPillar['Procurement and Suppliers'], iegPillar['Procurement and Suppliers']].filter((v) => v != null));
          const avgPublicEng = avg([ivcPillar['Public Engagement'], iegPillar['Public Engagement']].filter((v) => v != null));
          const avgGovernance = avg([ivcPillar['Governance'], iegPillar['Governance']].filter((v) => v != null));

          const avg4PGSum = avgPersonnel + avgProduction + avgProcSup + avgPublicEng + avgGovernance;

          return {
            'Company Name': c.company_name || null,
            'TIER': c.tier || null,
            'Validated Scores (%)': ivcSum,

            'IVC Personnel (%)': ivcPillar['Personnel'],
            'IVC Production (%)': ivcPillar['Production'],
            'IVC Procurement and Suppliers (%)': ivcPillar['Procurement and Suppliers'],
            'IVC Public Engagement (%)': ivcPillar['Public Engagement'],
            'IVC Governance (%)': ivcPillar['Governance'],

            'Industry Expert Group (%)': iegSum,
            'IEG Personnel (%)': iegPillar['Personnel'],
            'IEG Production (%)': iegPillar['Production'],
            'IEG Procurement and Suppliers (%)': iegPillar['Procurement and Suppliers'],
            'IEG Public Engagement': iegPillar['Public Engagement'],
            'IEG Governance': iegPillar['Governance'],

            'Average Personnel (%)': avgPersonnel,
            'Average Production (%)': avgProduction,
            'Average Procurement and Suppliers (%)': avgProcSup,
            'Average Public Engagement (%)': avgPublicEng,
            'Average Governance (%)': avgGovernance,
            'Average 4PG': avg4PGSum,
          };
        })
    );

    // Optional: sort by Average 4PG desc
    const sorted = resultRows.sort((a, b) => {
      const A = toNum(a['Average 4PG'] ?? -1);
      const B = toNum(b['Average 4PG'] ?? -1);
      return B - A;
    });

    return sorted;
  }
  };


  /**
   * Retrieves company IDs assigned to a user.
   * @param {string} userId - User ID.
   * @returns {Promise<Object[]|null>} Array of company assignment objects or null.
   */
  store.getUserAssignedCompaniesIds = async (userId) => {
    let allotations = await db.collection(COLLECTIONS.ALLOTATIONS).where('user_id', '==', userId).select('company_id').get();
    if (allotations.empty) return null;
    
    allotations = allotations.docs.map(docToObject);
    
    return Promise.all(allotations.map(async (allot) => {
      const company = await store.getCompanyById(allot.company_id);
      if(company){
        return {name: company.company_name, company_id: allot.company_id, id: allot.id};
      }
      else{
        return null;
      }
      
    }));
  };

  /**
   * Adds micro nutrient scores for a batch of scores.
   * @param {Object[]} scores - Array of score objects.
   * @returns {Promise<Object[]|boolean>} Array of persisted score objects or false.
   */
  store.addMicroNutrientScores = async (scores = []) => {
    try {
      const calcScore = (value, expectedValue) => Math.round((value / expectedValue) * 100);

      let savedScores = scores.map(async (score) => {
        const microNutrient = await store.getProductMicroNutrients(score.product_type, score.product_micro_nutrient_id);
        const sc = {
          ...score,
          percentage_compliance: calcScore(score.value, microNutrient.expected_value) || 0,
          created_at: firestore.FieldValue.serverTimestamp(),
          updated_at: firestore.FieldValue.serverTimestamp(),
        };

        return db.collection(COLLECTIONS.MICRO_NUTRIENTS_SCORES).add(sc);
      });

      savedScores = await Promise.all(savedScores);

      const persistedScores = await Promise.all(savedScores.map((score) => score.get()));
      return persistedScores.map(docToObject);
    } catch (err) {
      console.error('add micro nutrient scores', err);
      return false;
    }
  };

  /**
   * Aggregates users with their associated companies by user IDs.
   * @param {string[]} userIds - Array of user IDs.
   * @returns {Promise<Object[]>} Array of user objects with company data.
   */
  store.aggregateUsersWithCompaniesByUserIds = async (userIds) => {
    return await new Promise((resolve, reject) => {
      const promises = [];
      // Chunking cos firebase limits us to 10 items when using the "in" operator
      _.chunk(userIds, 10).forEach((arr) => {
        promises.push(db.collection(COLLECTIONS.COMPANY_USERS).where('user_id', 'in', arr).get());
      });
      Promise.all(promises)
        .then((resultsArr) => {
          const companyUsers = _.flatten(resultsArr.map((r) => r.docs)).map(docToObject);
          const companyIds = Array.from(new Set(companyUsers.map((n) => n.company_id)));
          const companyUsersGroupedByUserId = _.keyBy(companyUsers, 'user_id');
          return store.listCompaniesByUid(companyIds).then((companies) => {
            const companiesGroupedById = _.keyBy(companies, 'id');
            return store.listUsersByUid(userIds).then((users) => {
              resolve(
                users.map((u) => {
                  const companyUserPivot = companyUsersGroupedByUserId[u.id] || {};
                  u.company = companiesGroupedById[companyUserPivot.company_id] || null;
                  return u;
                })
              );
            });
          });
        })
        .catch(reject);
    });
  };

  /**
   * Paginates a Firestore query using before/after document IDs.
   * @param {Object} params - Pagination parameters.
   * @param {FirebaseFirestore.Query} params.query - Firestore query.
   * @param {string} params.collection - Collection name.
   * @param {string|null} params.before - Document ID to end before.
   * @param {string|null} params.after - Document ID to start after.
   * @param {number} params.size - Page size.
   * @returns {Promise<FirebaseFirestore.QuerySnapshot>} Query snapshot.
   */
  const paginateQuery = async ({query, collection, before, after, size = 15}) => {
    if (after) {
      const snapshot = await db.collection(collection).doc(after).get();
      query.startAfter(snapshot);
    }

    if (before) {
      const snapshot = await db.collection(collection).doc(before).get();
      query.endBefore(snapshot);
    }

    return await query.limit(size).get();
  };

  /**
   * Retrieves all admin members with associated data.
   * @returns {Promise<Object[]>} Array of admin user objects.
   */
  store.getAdminMembers = async () => {
    const admins = await db
      .collection(COLLECTIONS.ADMIN_USERS)
      .get();
    if (admins.empty) return [];

    const users = await Promise.all(admins.docs.map((doc) => store.getUserByUid(doc.data().user_id)));

    return await Promise.all(users.map(({auth_provider_id: uid}) => store.getUserWithAssociatedData(uid)));
  };

  /**
   * Retrieves all company members for admin with associated data.
   * @returns {Promise<Object[]>} Array of company user objects.
   */
  store.getCompanyMembersAdmin = async () => {
    const users = await db
      .collection(COLLECTIONS.USERS)
      .where('user_type_id', '==', "oPFdVuE6RvWOeiDYIuVM")
      .get();
    if (users.empty) return [];

    return  await Promise.all(users.docs.map((doc) => store.getCompanyDataUserByUserId(doc.id,doc.data())));

    //return await Promise.all(companyUsers.map(({auth_provider_id: uid}) => store.getUserWithAssociatedData(uid)));
  };

  /**
   * Retrieves a user and populates their associated data (company/admin, roles, companies).
   * @param {string} uid - Auth provider ID.
   * @returns {Promise<Object>} User object with associations.
   */
  store.getUserWithAssociatedData = async (uid) => {
    const user = await store.getUserByAuthId(uid);
    user.user_type = await store.getUserTypeById(user.user_type_id);

    if (user.user_type.value && user.user_type.value.toLowerCase() === USER_TYPES.PARTICIPATING_COMPANY) {
      user.company_user = await store.getCompanyUserByUserId(user.id);
      if(user.company_user){
        user.role = user.company_user.role.id;
      }
    } else if (user.user_type.value && user.user_type.value.toLowerCase() === USER_TYPES.ADMIN) {
      user.admin_user = await store.getAdminUserByUserId(user.id);
      user.companies = await store.getUserAssignedCompaniesIds(user.id);
      user.role = user.admin_user.role.id;
    }

    return user;
  };

  /**
   * Retrieves all admin roles.
   * @returns {Promise<Object[]>} Array of admin role objects.
   */
  store.getAdminRoles = async () => {
    const roles = await db
      .collection(COLLECTIONS.ADMIN_ROLES)
      .get();
    if (roles.empty) return [];

    return roles.docs.map(docToObject);
  };

  /**
   * Retrieves all members of a company.
   * @param {string} companyId - Company ID.
   * @returns {Promise<Object[]>} Array of user objects with company data.
   */
  store.getCompanyMembers = async (companyId) => {
    const companyUsersSnapshot = await db
      .collection(COLLECTIONS.COMPANY_USERS)
      .where('company_id', '==', companyId)
      .get();
    if (companyUsersSnapshot.empty) return [];
    return store.aggregateUsersWithCompaniesByUserIds(
      companyUsersSnapshot.docs.map((doc) => doc.data().user_id)
    );
  };

  /**
   * Retrieves companies assigned to a user, with additional details.
   * @param {string} userId - User ID.
   * @param {string|null} before - Document ID to end before.
   * @param {string|null} after - Document ID to start after.
   * @param {number} size - Page size.
   * @returns {Promise<Object[]>} Array of company objects with details.
   */
  store.getAssignedCompanies = async (userId, before, after, size = 15) => {
    const query = db.collection(COLLECTIONS.ALLOTATIONS).where('user_id', '==', userId);

    const snapshot = await paginateQuery({
      query,
      before,
      after,
      size,
      collection: COLLECTIONS.ALLOTATIONS,
    });

    if (snapshot.empty) return [];

    return await Promise.all(
      snapshot.docs.map(async (doc) => {
        const pivotData = doc.data();
        const companyDetails = await store.getCompanyById(pivotData.company_id);
        const activeCyle = await store.getActiveSATCycle(pivotData.cycle_id);
        const brands = await store.getCompanyBrands(pivotData.company_id);
        const scores = await store.getSatScores(pivotData.company_id, activeCyle.id);

        return {
          ...companyDetails,
          scores,
          brands,
        };
      })
    );
  };

  /**
   * Retrieves company aggregate scores for admin index.
   * @param {string|null} before - Document ID to end before.
   * @param {string|null} after - Document ID to start after.
   * @param {number} size - Page size.
   * @param {string} cycle - Cycle ID.
   * @returns {Promise<Object[]>} Array of company aggregate score objects.
   */
  store.getAdminIndex = async (before, after, size = 15,cycle) => {
    const companies = await store.getCompanies(before, after, size);
    //const activeCyle = await store.getActiveSATCycle();
    if (companies.length < 1) return [];

    return await Promise.all(
      companies.map(async (doc) => {
        return store.getCompanyAggsScore(doc.id,cycle);
      })
    );
  };

  /**
   * Placeholder for fetching documents associated with a brand.
   * @param {string} brandId - Brand ID.
   */
  store.getBrandsAssociatedDocuments = async (brandId) => {
    // const brands = await store.getBrandById(brandId);
  };

  /**
   * Retrieves a ranking list of companies with aggregate scores for a cycle.
   * @param {string|null} before - Document ID to end before.
   * @param {string|null} after - Document ID to start after.
   * @param {number} size - Page size.
   * @param {string|number} cycle_id - Cycle ID or 0 for active.
   * @returns {Promise<Object[]>} Array of company aggregate score objects.
   */
  store.rankingList = async (before, after, size = 15,cycle_id=0) => {
    const companies = await store.getCompanies(before, after, size);
    //const activeCyle = await store.getActiveSATCycle();
    const cycleId = (cycle_id!=0)
      ? cycle_id
      : (await store.getActiveSATCycle()).id;

    if (companies.length < 1) return [];

    return Promise.all(
      companies.map(async (doc) => {
        return store.getCompanyAggsScore(doc.id, cycleId);
      })
    );
  };

  /**
   * Retrieves a ranking list of companies with aggregate scores for a cycle.
   * @param {string|null} before - Document ID to end before.
   * @param {string|null} after - Document ID to start after.
   * @param {number} size - Page size.
   * @param {string|number} cycle_id - Cycle ID or 0 for active.
   * @returns {Promise<Object[]>} Array of company aggregate score objects.
   */
  store.indexRankingList = async (before, after, size = 15, cycle_id = 0) => {
    const companies = await store.getCompanies(before, after, size);
    //const activeCyle = await store.getActiveSATCycle();
    const cycleId = (cycle_id != 0)
      ? cycle_id
      : (await store.getActiveSATCycle()).id;

    if (companies.length < 1) return [];

    let data = [];
    // Fetch all company aggregate scores in parallel and then push to data array
    await Promise.all(
      companies.map(async (doc) => {
        const score = await store.getCompanyAggsScoreV2(doc.id, cycleId);
        data.push(...score);
      })
    );
    return data;
  };

  /**
   * Retrieves question categories by an array of IDs.
   * @param {string[]} categoryIds - Category IDs.
   * @returns {Promise<Object[]|null>} Array of category objects or null.
   */
  store.getQuestionCategoriesByIds = async (categoryIds = []) => {
    try {
      if (!(categoryIds && categoryIds.length)) return [];

      const refs = categoryIds.map((id) => db.collection(COLLECTIONS.QUESTION_CATEGORIES).doc(id));

      let categories = await db.getAll(...refs);

      if (categories.empty) return [];

      categories = categories.filter((c) => c.data());

      return categories.map(docToObject);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  /**
   * Retrieves parent categories for a list of category IDs.
   * @param {string[]} categoryIds - Category IDs.
   * @param {boolean} rootOnly - Whether to return only root parent categories.
   * @returns {Promise<Object[]|null>} Array of parent category objects or null.
   */
  store.getQuestionParentCategories = async (categoryIds = [], rootOnly = false) => {
    try {
      const catIds = _.uniq(categoryIds);
      const categories = await store.getQuestionCategoriesByIds(catIds);

      if (!(categories && categories.length)) return [];

      const parentIds = _.uniq(categories.map(({parent_id: id}) => id));

      const parents = await store.getQuestionCategoriesByIds(parentIds);

      return parents.map((parent) => {
        const children = categories
          .filter(({parent_id: par}) => par == parent.id)
          .map(({id}) => id);

        return {...parent, children};
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  /**
   * Retrieves micro nutrient scores and details for a set of score IDs and a product.
   * @param {string[]} scoreIds - Micro nutrient score IDs.
   * @param {string} productId - Product type ID.
   * @returns {Promise<Object[]>} Array of score objects with micro nutrient details.
   */
  store.getProductMicroNutrientScores = async (scoreIds, productId) =>
    await new Promise(async (resolve, reject) => {
      try {
        if (scoreIds && scoreIds.length === 0) return resolve([]);

        const refs = scoreIds.map((id) => db.collection(COLLECTIONS.MICRO_NUTRIENTS_SCORES).doc(id));

        if (refs.length === 0) return resolve([]);

        let query = await db.getAll(...refs);

        query = query.filter((doc) => doc.exists);

        if (query.length < 1) resolve([]);

        const values = query.map((doc) => docToObject(doc));

        resolve(await Promise.all(
          values.map(async (score) => {
            const microNutrient = await store.getProductMicroNutrients(
              productId,
              score.product_micro_nutrient_id
            );

            return {
              ...score,
              microNutrient,
            };
          })
        )
        );
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });

  /**
   * Retrieves product tests for a company and cycle.
   * @param {string} companyId - Company ID.
   * @param {string|null} cycleId - Optional cycle ID.
   * @returns {Promise<Object[]>} Array of product test objects.
   */
  store.getCompanyProductTests = async (companyId, cycleId = null) => {
    let query = db
      .collection(COLLECTIONS.PRODUCT_TESTING)
      .where('company_id', '==', companyId);

    if (cycleId) query = query.where('cycle_id', '==', cycleId);

    query = await query.get();

    if (query.empty) return [];

    return await Promise.all(
      query.docs.map(async (doc) => {
        const data = docToObject(doc);
        const results = await store.getProductMicroNutrientScores(
          data.micro_nutrients_results,
          data.product_type
        );

        const productType = await store.getProductTypeById(data.product_type);

        return {
          ..._.omit(data, ['micro_nutrients_results', 'product_type']),
          productType,
          results,
        };
      })
    );
  };

  /**
   * Retrieves product tests for a brand and cycle.
   * @param {string} brandId - Brand ID.
   * @param {string} cycleId - Cycle ID.
   * @returns {Promise<Object[]>} Array of product test objects.
   */
  store.getBrandProductTests = async (brandId, cycleId) => {
    let query = db
      .collection(COLLECTIONS.PRODUCT_TESTING)
      .where('brand_id', '==', brandId)
      .orderBy('sample_production_date', 'desc');

    if (cycleId) query = query.where('cycle_id', '==', cycleId);

    query = await query.get();

    if (query.empty) return [];

    return await Promise.all(
      query.docs.map(async (doc) => {
        const data = docToObject(doc);
        const results = await store.getProductMicroNutrientScores(
          data.micro_nutrients_results,
          data.product_type
        );

        return {
          ..._.omit(data, ['micro_nutrients_results', 'cycle_id']),
          results,
        };
      })
    );
  };

  /**
   * Retrieves aggregate scores for a company for a cycle (and optionally user).
   * @param {string} companyId - Company ID.
   * @param {string|null} cycleId - Cycle ID.
   * @param {Object|null} user - Optional user object.
   * @returns {Promise<Object>} Aggregate score object for the company.
   */
  store.getCompanyAggsScore = async (companyId, cycleId = null, user = null) => {
    const company = await store.getCompanyById(companyId);

    if (!company) return company;

    let brands = await store.getCompanyBrands(companyId);

    brands = await Promise.all(
      brands.map(async (brand) => ({
        ..._.omit(brand, ['product_type', 'created_at', 'updated_at']),
        productTests: await store.getBrandProductTests(brand.id, cycleId),
        productType: await store.getProductTypeById(brand.product_type)
      }))
    );

    const iegScores = await store.getIEGScores(companyId, 'IEG', cycleId, user, !cycleId);
    const satScores = await store.getCompanySatScores(companyId, cycleId, user, !cycleId);
    const ivcScores = await store.getCompanyIvcScores(companyId, cycleId, user);
    // const productTests = await store.getCompanyProductTests(companyId, cycleId);

    // const satTotal = satScores.reduce((accum, {score}) => accum + score, 0);
    const iegTotal = iegScores.reduce((accum, {value}) => accum + value, 0) * 0.2;
    const ivcTotal = ivcScores.reduce((accum, {value}) => accum + value, 0);

    // if (company.tier == COMPANY_TIERS.TIER_1) {
    //   satTotal = ivcScores ? satTotal * 0.4 : satTotal * 0.2;
    // } else {
    //   satTotal = ivcScores ? satTotal * 0.6 : satTotal * 0.3;
    // }

    // const ptResults = productTests.reduce((accum, {fortification}) => [...accum, fortification], []);
    // const ptTotals = ptResults.reduce((accum, {score}) => accum + score, 0) * 0.2;
    // const overallweightedscore = satTotal + iegTotal;// + ptTotals;

    return {
      ...company,
      brands,
      ivcScores,
      iegScores,
      satScores,
      // productTests,
      ivcTotal,
      // satTotal,
      iegTotal,
      // overallweightedscore
    };
  };

  /**
   * Retrieves aggregate scores for a company for a cycle (and optionally user).
   * @param {string} companyId - Company ID.
   * @param {string|null} cycleId - Cycle ID.
   * @param {Object|null} user - Optional user object.
   * @returns {Promise<Object>} Aggregate score object for the company.
   */
  store.getCompanyAggsScoreV2 = async (companyId, cycleId = null, user = null) => {
    const company = await store.getCompanyById(companyId);

    if (!company) return company;

    const iegScores = await store.getAssessmentScores({
      companyId,
      cycleId,
      type: 'IEG'
    });
  
    const ivcScores = await store.getAssessmentScores({
      companyId,
      cycleId,
      type: 'IVC'
    });
    const iegTotal = iegScores.reduce((accum, { score }) => accum + score, 0) * 0.2;
    const ivcTotal = ivcScores.reduce((accum, { score }) => accum + score, 0) * 0.60;

    let brands = await store.getCompanyBrands(companyId);

    brands = await Promise.all(
      brands.map(async (brand) => ({
        ..._.omit(company, ['company_size', 'created_at', 'updated_at']),
        ..._.omit(brand, ['product_type', 'created_at', 'updated_at']),
        productTests: await store.getBrandProductTests(brand.id, cycleId),
        productType: await store.getProductTypeById(brand.product_type),
        ieg: iegTotal,
        ivc: ivcTotal
      }))
    );

    

    return brands;
  };

  /**
   * Saves a product testing result and associated micro nutrient scores.
   * @param {Object} payload - Product testing data.
   * @returns {Promise<Object>} Saved product testing object.
   */
  store.saveProductTesting = async (payload) => {
    let {scores, company_id: companyId, cycle_id: cycleId} = payload;
    const validators = await Promise.all([
      store.getCompanyById(companyId),
      store.getBrandById(payload.brand_id),
      store.getActiveSATCycle(cycleId),
      ...scores.map(({product_micro_nutrient_id: id}) => getProductMicroNutrientById(id)),
    ]);

    if (validators.some((doc) => !doc)) {
      throw new Error('One of the item does not exist in the DB.');
    }

    const brand = await store.getBrandById(payload.brand_id);
    const productType = await store.getProductTypeById(brand.product_type);

    scores = scores.map((doc) => ({...doc, company_id: companyId, cycle_id: cycleId, product_type: brand.product_type}));

    const microNutrientScores = await store.addMicroNutrientScores(scores);

    if (!microNutrientScores) throw new Error('Error saving testing scores.');

    let fortification = {
      message: null,
      score: 0
    };


    const adjustedScores = microNutrientScores.map(({percentage_compliance: compliance, ...others}) => ({...others, mfiScore: compliance >= 80 ? 20 : compliance >= 51 ? 10 : compliance >= 31 ? 5 : 0}));

    let overallScore = adjustedScores.reduce((accum, {mfiScore}) => accum + mfiScore, 0);

    if (productType.name === 'Flour') overallScore = overallScore / 3;

    fortification = {score: overallScore, message: overallScore >= 20 ? 'Fully Fortified' : overallScore >= 10 ? 'Mostly Fortified' : overallScore >= 5 ? 'Partly Fortified' : 'Not Fortified'};

    const productTest = {
      ..._.omit(payload, 'scores'),
      product_type: brand.product_type,
      fortification,
      micro_nutrients_results: microNutrientScores.map(({id}) => id),
    };

    const test = await db.collection(COLLECTIONS.PRODUCT_TESTING).add(productTest);

    return docToObject(await test.get());
  };

  /**
   * Retrieves a product micro nutrient by ID.
   * @param {string} id - Micro nutrient ID.
   * @returns {Promise<Object|null>} Micro nutrient object or null.
   */
  const getProductMicroNutrientById = async (id) => {
    try {
      const data = await db.collection(COLLECTIONS.PRODUCT_MICRO_NUTRIENTS).doc(id).get();

      if (!data.exists) return null;
      return docToObject(data);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  /**
   * Returns a function to get an invite by email for a collection.
   * @param {string} collection - Collection name.
   * @returns {Function} Function to get invite by email.
   */
  const getInviteByEmail = (collection) => async (email) => {
    const invite = await db
      .collection(collection)
      .where('email', '==', email)
      .get();

    if (invite.empty) return null;
    return docToObject(invite.docs[0]);
  };

  /**
   * Returns a function to create an invite in a collection.
   * @param {string} collection - Collection name.
   * @returns {Function} Function to create invite.
   */
  const createInvite = (collection) => async (email, opts = {}) => {
    const body = {
      uuid: uuidv4(), email, accepted: false, ...opts
    };

    const invite = await db.collection(collection).add({
      ...body,
      created_at: firestore.FieldValue.serverTimestamp(),
      updated_at: firestore.FieldValue.serverTimestamp(),
    });

    return docToObject(await invite.get());
  };

  /**
   * Returns a function to delete an invite by ID from a collection.
   * @param {string} collection - Collection name.
   * @returns {Function} Function to delete invite by ID.
   */
  const deleteInvite = (collection) => async (id) => {
    try {
      await db.collection(collection).doc(id).delete();
      return true;
    } catch (error) {
      console.error('store: delete team member invite', error);
      return false;
    }
  };

  /**
   * Deletes an assigned company by ID.
   * @param {string} id - Assignment document ID.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  store.deleteAssignedCompany = async (id) => {
    try {
      await db.collection(COLLECTIONS.ALLOTATIONS).doc(id).delete();
      return true;
    } catch (error) {
      console.error('store: assigned company delete failed.', error);
      return false;
    }
  };
  /**
   * Deletes a user and their authentication record.
   * @param {string} id - User document ID.
   * @param {string} authId - Auth provider ID.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  store.deleteUser = async (id,authId) => {
    try {
      await db.collection(COLLECTIONS.USERS).doc(id).delete();
      await auth.deleteUser(authId);
      return true;
    } catch (error) {
      console.error('store:user delete failed.', error);
      return false;
    }
  };
  /**
   * Deletes a product testing record and a micro nutrient score.
   * @param {string} ptid - Product testing document ID.
   * @param {string} microid - Micro nutrient score document ID.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  store.deleteMicroNutrientScore = async (ptid,microid) => {
    try {
      await db.collection(COLLECTIONS.PRODUCT_TESTING).doc(ptid).delete();
      await db.collection(COLLECTIONS.MICRO_NUTRIENTS_SCORES).doc(microid).delete();
      return true;
    } catch (error) {
      console.error('store: deleteMicroNutrientScore delete failed.', error);
      return false;
    }
  };
  /**
   * Deletes all company-related data from Firestore and Storage for a company ID.
   * @param {string} id - Company ID.
   * @returns {Promise<void>}
   */
  store.deleteCompanyData = async (id) => {
    const batch = db.batch();

    try{
      const assessmentScoresQuery = db.collection(COLLECTIONS.ASSESSMENT_SCORES).where("company_id", '==', id);
      const assessmentScoresData = await assessmentScoresQuery.get();
      assessmentScoresData.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const commentsQuery = db.collection(COLLECTIONS.COMMENTS).where("company_id", '==', id);
      const commentsData = await commentsQuery.get();
      commentsData.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const brandsQuery = db.collection(COLLECTIONS.COMPANY_BRANDS).where("company_id", '==', id);
      const brandsData = await brandsQuery.get();
      brandsData.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const microNScoresQuery = db.collection(COLLECTIONS.MICRO_NUTRIENTS_SCORES).where("company_id", '==', id);
      const microNScoresData = await microNScoresQuery.get();
      microNScoresData.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const productTestingQuery = db.collection(COLLECTIONS.PRODUCT_TESTING).where("company_id", '==', id);
      const productTestingData = await productTestingQuery.get();
      productTestingData.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const saAnswersQuery = db.collection(COLLECTIONS.SA_ANSWERS).where("company_id", '==', id);
      const saAnswersData = await saAnswersQuery.get();
      saAnswersData.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const ivcAnswersQuery = db.collection(COLLECTIONS.IVC_ANSWERS).where("company_id", '==', id);
      const ivcAnswersData = await ivcAnswersQuery.get();
      ivcAnswersData.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const allotationsQuery = db.collection(COLLECTIONS.ALLOTATIONS).where("company_id", '==', id);
      const allotationsData = await allotationsQuery.get();
      allotationsData.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const companyUsersQuery = db.collection(COLLECTIONS.COMPANY_USERS).where("company_id", '==', id);
      const companyUsersData = await companyUsersQuery.get();
      companyUsersData.forEach(async (doc) => {
        batch.delete(doc.ref);
      });

      const documentsQuery = db.collection(COLLECTIONS.DOCUMENTS).where("company_id", '==', id);
      const documentsData = await documentsQuery.get();
      const admin = getFirebaseAdmin();
      const bucket = admin.storage().bucket();
      documentsData.forEach((doc) => {
        let mDoc = docToObject(doc);
        bucket.file(mDoc.file_name).delete();
        batch.delete(doc.ref);
      });

      const ParticipatingCompaniesRef = await db.collection(COLLECTIONS.PARTICIPATING_COMPANIES).doc(id);
      const ParticipatingCompaniesDocIsOk = (async () => {
        const doc = await ParticipatingCompaniesRef.get();
        if (!doc.exists) return false;
        return doc.data().id == id;
      })();
      if (ParticipatingCompaniesDocIsOk) batch.delete(ParticipatingCompaniesRef);

      await batch.commit();
    } catch(err){ 
      console.error("DELETE ERROR",err)
    }

      
  };

  /**
   * Returns a function to get an invite by ID from a collection.
   * @param {string} collection - Collection name.
   * @returns {Function} Function to get invite by ID.
   */
  const getInviteById = (collection) => async (id) => {
    const invite = await db.collection(collection).doc(id).get();

    if (!invite.exists) return null;
    return docToObject(invite);
  };

  /**
   * Returns a function to create a user in a collection.
   * @param {string} collection - Collection name.
   * @returns {Function} Function to create user.
   */
  const createUser = (collection) => async (data) => {
    const user = await db
      .collection(collection)
      .add({
        ...data,
        created_at: firestore.FieldValue.serverTimestamp(),
        updated_at: firestore.FieldValue.serverTimestamp(),
      })
      .then((ref) => ref.get());

    return docToObject(user.data());
  };

  store.createCompanyUser = createUser(COLLECTIONS.COMPANY_USERS);
  store.createAdminUser = createUser(COLLECTIONS.ADMIN_USERS);

  store.deleteTeamMemberInvite = deleteInvite(COLLECTIONS.COMPANY_INVITATIONS);
  store.deleteAdminTeamMemberInvite = deleteInvite(COLLECTIONS.ADMIN_INVITATIONS);

  store.getTeamMemberInviteById = getInviteById(COLLECTIONS.COMPANY_INVITATIONS);
  store.getAdminTeamMemberInviteById = getInviteById(COLLECTIONS.ADMIN_INVITATIONS);

  store.createTeamMemberInvite = createInvite(COLLECTIONS.COMPANY_INVITATIONS);
  store.createAdminTeamMemberInvite = createInvite(COLLECTIONS.ADMIN_INVITATIONS);

  store.getTeamMemberInviteByEmail = getInviteByEmail(COLLECTIONS.COMPANY_INVITATIONS);
  store.getAdminTeamMemberInviteByEmail = getInviteByEmail(COLLECTIONS.ADMIN_INVITATIONS);

  store.getSatAnswers = store.getAssessmentAnswers(COLLECTIONS.SA_ANSWERS);
  store.getPreviousSatAnswers = store.getPreviousAssessmentAnswers(COLLECTIONS.SA_ANSWERS);
  store.getIvcAnswers = store.getAssessmentAnswers(COLLECTIONS.IVC_ANSWERS);

  /**
   * Retrieves IEG scores for a company, type, and cycle, with optional user and approval filter.
   * @param {string} companyId - Company ID.
   * @param {string} type - Score type.
   * @param {string|null} cycleId - Cycle ID.
   * @param {Object|null} user - Optional user object.
   * @param {boolean} showUnapproved - Whether to include unapproved scores.
   * @returns {Promise<Object[]|string>} Array of score objects or error string.
   */
  store.getIEGScores = async (companyId, type, cycleId = null, user = null, showUnapproved = false) => {
    if (user && !((await isCompanyMember(store, user, companyId) || isMFIAdmin(user)))) {
      return 'You are not allowed to get IEG scores.';
    }

    let query = db
      .collection(COLLECTIONS.ASSESSMENT_SCORES)
      .where('company_id', '==', companyId)
      .where('type', '==', type);

    if (!showUnapproved && type == 'SAT') query = query.where('approved', '==', true);
    if (cycleId) query = query.where('cycle_id', '==', cycleId);

    const data = await query.get();

    if (data.empty) return [];

    const docs = data.docs.map(docToObject);
    const categories = await store.getQuestionCategoriesByIds(docs.map(({category_id: id}) => id));

    return docs.map((doc) => ({
      ..._.omit(doc, 'category_id'),
      category: categories.find((c) => c.id == doc.category_id)
    }));
  };

  /**
   * Returns a function to get company assessment scores using a utility.
   * @param {Function} assesstUtil - Assessment utility function.
   * @returns {Function} Function to get company assessment scores.
   */
  store.getCompanyAssessmentScores = (assesstUtil) => async (companyId, cycleId, user = null, showUnapproved = false) => {
    if (user && !((await isCompanyMember(store, user, companyId) || isMFIAdmin(user)))) {
      return 'You are not allowed to get SAT scores.';
    }

    const satScores = await assesstUtil(companyId, [], cycleId, showUnapproved);
    const questionIds = satScores.map(({category_id: cat}) => cat);
    const fullVersion = satScores.some(({tier}) => tier != 'TIER_1');

    const categories = await store.getQuestionParentCategories(questionIds);

    return categories.map((category) => {
      const scores = satScores.filter(({category_id: cat}) => category.children.includes(cat));

      let score = scores.reduce((accum, sat) => accum + satCalc(fullVersion)(sat), 0);

      score = (score / category.children.length) * (category.weight / 100);

      return { name: category.name, score, pointer: category.pointer, category_id: category.id };
    });
  };

  // Shortcuts for updating or creating SAT/IVC answers
  store.updateOrCreateSATAnswer = store.updateOrCreateAssessmentAnswers(COLLECTIONS.SA_ANSWERS, store);
  store.updateOrCreateIVCAnswer = store.updateOrCreateAssessmentAnswers(COLLECTIONS.IVC_ANSWERS, store);

  // Shortcuts for getting company assessment scores
  store.getCompanySatScores = store.getCompanyAssessmentScores(store.getSatAnswers);
  store.getCompanyIvcScores = store.getCompanyAssessmentScores(store.getIvcAnswers);

  /**
   * Activates a company by setting its active status to true.
   * @param {string} companyId - Company ID.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  store.activateCompany = async (companyId) => {
    try {
      const ref = db.collection(COLLECTIONS.PARTICIPATING_COMPANIES).doc(companyId);

      if(!(await ref.get()).exists) return false;
      await ref.update({active: true});
      return true;
    }
    catch(err){
      console.error(err);
      return false;
    }
  }
  /**
   * Deactivates a company by setting its active status to false.
   * @param {string} companyId - Company ID.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  store.deactivateCompany = async (companyId) => {
    try {
      const ref = db.collection(COLLECTIONS.PARTICIPATING_COMPANIES).doc(companyId);

      if(!(await ref.get()).exists) return false;
      await ref.update({active: false});
      return true;
    }
    catch(err){
      console.error(err);
      return false;
    }
  }
  /**
   * Exports SAT data for a company and cycle to a Google Sheet.
   * @param {string} cycleId - Cycle ID.
   * @param {string} companyId - Company ID.
   * @returns {Promise<Object>} Result object with message and sheetId or error.
   */
  store.satExport = async (cycleId, companyId) => {
    try {
      const functions = require("firebase-functions");
      const { google } = require("googleapis");

      const auth = new google.auth.GoogleAuth({
        credentials: functions.config().google.credentials,
        scopes: [
          "https://www.googleapis.com/auth/spreadsheets",
          "https://www.googleapis.com/auth/drive",
        ],
      });

      const sheets = google.sheets({ version: "v4", auth });
      const drive = google.drive({ version: "v3", auth });

      // === Fetch Company & Cycle Data ===
      const companyDoc = await db.collection("ParticipatingCompanies").doc(companyId).get();
      if (!companyDoc.exists) return { message: "Company not found" };

      const cycleDoc = await db.collection("SACycles").doc(cycleId).get();
      if (!cycleDoc.exists) return { message: "Cycle not found" };

      const company = companyDoc.data();
      const cycle = cycleDoc.data();
      const sheetTitle = `${cycle.name} - ${company.company_name}`.substring(0, 60);

      // === Create Google Sheet ===
      const { data: spreadsheet } = await sheets.spreadsheets.create({
        resource: { properties: { title: sheetTitle } },
      });

      const spreadsheetId = spreadsheet.spreadsheetId;
      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
      const email = "tobidurotoye@gmail.com";

      // === Grant Access to Email ===
      await drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: { role: "writer", type: "user", emailAddress: email },
      });

      // === Get First Sheet ID ===
      const { data: sheetMetadata } = await sheets.spreadsheets.get({ spreadsheetId });
      const firstSheetId = sheetMetadata.sheets[0]?.properties?.sheetId || 0;

      // Fetch categories
      const mCategoriesSnapshot = await db.collection("QuestionCategories").where("parent_id", "==", "").orderBy("sort_order", "asc").get();
      const mCategories = mCategoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // === Rename First Sheet to First Category Name ===
      if (mCategories.length > 0) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          resource: {
            requests: [
              {
                updateSheetProperties: {
                  properties: { sheetId: firstSheetId, title: mCategories[0].name.substring(0, 30) },
                  fields: "title",
                },
              },
            ],
          },
        });
      }

      // === Fetch Firestore Data in Batches ===
      const [
        categoriesSnapshot,
        questionsSnapshot,
        answersSnapshot,
        ivcAnswersSnapshot,
        documentsSnapshot,
        commentsSnapshot,
        tiersSnapshot,
        usersSnapshot
      ] = await Promise.all([
        db.collection("QuestionCategories").where("parent_id", "==", "").orderBy("sort_order", "asc").get(),
        db.collection("SAQuestion").orderBy("sort_order", "asc").get(),
        db.collection("SAAnswers").where("company_id", "==", companyId).where("cycle_id", "==", cycleId).get(),
        db.collection("IVCAnswers").where("company_id", "==", companyId).where("cycle_id", "==", cycleId).get(),
        db.collection("Documents").where("owner_type", "==", "category").where("company_id", "==", companyId).get(),
        db.collection("Comments").where("owner_type", "==", "category").where("company_id", "==", companyId).get(),
        db.collection("QuestionTiers").orderBy("sort_order", "asc").get(),
        db.collection("Users").get()
      ]);

      // === Convert Firestore Snapshots to Lookup Objects ===
      const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const questions = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const answers = Object.fromEntries(answersSnapshot.docs.map(doc => [doc.data().category_id, doc.data().value]));
      const ivcAnswers = Object.fromEntries(ivcAnswersSnapshot.docs.map(doc => [doc.data().category_id, doc.data().value]));
      let tiers = tiersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const users = Object.fromEntries(usersSnapshot.docs.map(doc => [doc.id, doc.data()]));
      if (company.tier == "TIER_1") {
        tiers = tiers.filter(tier => tier.tier_constant == "TIER_1");
      }
      // Preprocess documents & comments
      const documents = {};
      documentsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!documents[data.owner_id]) documents[data.owner_id] = [];
        documents[data.owner_id].push(`- https://www.googleapis.com/download/storage/v1/b/technoserve-mfi.appspot.com/o/${data.file_name}?generation=${data.storage_id.toString().split('/').pop()}&alt=media`);
      });

      const comments = {};
      commentsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!comments[data.owner_id]) comments[data.owner_id] = [];
        const user = users[data.user_id] || { full_name: "Unknown" };
        comments[data.owner_id].push(`- ${user.full_name} (${data.created_at.toDate().toLocaleDateString()}): ${data.content}`);
      });

      let batchRequests = [];
      let sheetIdMap = { [categories[0].id]: firstSheetId };

      // === Create New Sheets for Remaining Categories ===
      for (let i = 1; i < categories.length; i++) {
        batchRequests.push({ addSheet: { properties: { title: categories[i].name.substring(0, 30) } } });
      }

      // === Batch Create Sheets ===
      const addSheetResponse = await sheets.spreadsheets.batchUpdate({ spreadsheetId, resource: { requests: batchRequests } });

      // === Assign Sheet IDs ===
      let requestIndex = 0;
      for (let i = 1; i < categories.length; i++) {
        if (addSheetResponse.data.replies[requestIndex]?.addSheet) {
          sheetIdMap[categories[i].id] = addSheetResponse.data.replies[requestIndex].addSheet.properties.sheetId;
        }
        requestIndex++;
      }

      batchRequests = [];

      // === Insert Data into Sheets ===
      for (const category of categories) {
        const sheetId = sheetIdMap[category.id];
        let values = [["Section", "Objective", "Level", "Evidence Descriptor", "Answer", "IVC Answer", "Documents", "Comments"]];

        const subCategoriesSnapshot = await db.collection("QuestionCategories").where("parent_id", "==", category.id).orderBy("sort_order", "asc").get();
        const subCategories = subCategoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        for (const subCategory of subCategories) {
          for (const tier of tiers) {
            const subCategoryQuestions = questions.filter(q => q.category_id === subCategory.id && q.tier_id === tier.id);
            const evidenceDescriptor = subCategoryQuestions.map(q => `- ${q.value}`).join("\n");

            values.push([
              subCategory.name,
              subCategory.description,
              tier.name,
              evidenceDescriptor,
              answers[subCategory.id] || "",
              ivcAnswers[subCategory.id] || "",
              (documents[subCategory.id] || []).join("\n"),
              (comments[subCategory.id] || []).join("\n"),
            ]);
          }
        }

        batchRequests.push({
          updateCells: {
            rows: values.map(row => ({ values: row.map(cell => ({ userEnteredValue: { stringValue: cell } })) })),
            fields: "userEnteredValue",
            start: { sheetId: sheetId, rowIndex: 0, columnIndex: 0 },
          },
        });
      }

      // === Batch Insert Data into Sheets ===
      await sheets.spreadsheets.batchUpdate({ spreadsheetId, resource: { requests: batchRequests } });

      console.log("Sheet created:", spreadsheetUrl);
      return { message: "Sheet created", sheetId: spreadsheetId };

    } catch (error) {
      console.error("Error creating sheet:", error);
      return { message: "Error creating sheet", error: error.message };
    }
  };

  return store;
};



/* eslint-disable no-fallthrough */

const satCalc
  = (version) =>
    ({value, tier}) => {
      switch (value) {
        case 'FULLY_MET':
          switch (tier) {
            case 'TIER_1':
              return version ? (3.33 / 3.33) * 100 * 0.6 : (3.33 / 3.33) * 100;
            case 'TIER_2':
              return (0.83 / 0.83) * 25;
            case 'TIER_3':
              return (0.5 / 0.5) * 15;
            default:
              return 0;
          }
        case 'MOSTLY_MET':
          switch (tier) {
            case 'TIER_1':
              return version ? (2.5 / 3.33) * 100 * 0.6 : (2.5 / 3.33) * 100;
            case 'TIER_2':
              return (0.63 / 0.83) * 25;
            case 'TIER_3':
              return (0.38 / 0.5) * 15;
            default:
              return 0;
          }
        case 'PARTLY_MET':
          switch (tier) {
            case 'TIER_1':
              return version ? (1.8 / 3.33) * 100 * 0.6 : (1.8 / 3.33) * 100;

            case 'TIER_2':
              return (0.45 / 0.83) * 25;
            case 'TIER_3':
              return (0.27 / 0.5) * 15;
            default:
              return 0;
          }
        case 'NOT_MET':
          switch (tier) {
            case 'TIER_1':
              return version ? (0.5 / 3.33) * 100 * 0.6 : (0.5 / 3.33) * 100;
            case 'TIER_2':
              return (0.13 / 0.83) * 25;
            case 'TIER_3':
              return (0.08 / 0.5) * 15;
            default:
              return 0;
          }
      }
    };

// Manual upsert implementation for firestore
const upsertAssessmentScore = (db) => async (originalScore) => {
  const calcScore = ({value, weight}) => Math.round((value * weight) / 100);

  const score = {...originalScore, score: calcScore(originalScore)};

  const {company_id: companyId, cycle_id: cycleId, category_id: catId, type} = score;
  const scoreDoc = await db.collection(COLLECTIONS.ASSESSMENT_SCORES).where('company_id', '==', companyId).where('cycle_id', '==', cycleId).where('category_id', '==', catId).where('type', '==', type).get();

  if (scoreDoc.empty) {
    return db.collection(COLLECTIONS.ASSESSMENT_SCORES).add({...score, created_at: firestore.FieldValue.serverTimestamp()});
  } else {
    const scoreDocRef = scoreDoc.docs[0].ref;
    return scoreDocRef.update({...score, updated_at: firestore.FieldValue.serverTimestamp()});
  }
};

const upsertSATAssessmentScore = (db, type, companyId, cycleId) => async (originalScore) => {
  console.log('upsertSATAssessmentScore', type, companyId, cycleId, originalScore);
  const score = { ...originalScore, type };
  console.log('score', score);

  const { category_id: catId } = score;
  console.log('upsertSATAssessmentScore', catId);
  const scoreDoc = await db.collection(COLLECTIONS.ASSESSMENT_SCORES).where('company_id', '==', companyId).where('cycle_id', '==', cycleId).where('category_id', '==', catId).where('type', '==', type).get();

  if (scoreDoc.empty) {
    return db.collection(COLLECTIONS.ASSESSMENT_SCORES).add({ ...score, company_id: companyId, cycle_id: cycleId, created_at: firestore.FieldValue.serverTimestamp() });
  } else {
    const scoreDocRef = scoreDoc.docs[0].ref;
    return scoreDocRef.update({ ...score, updated_at: firestore.FieldValue.serverTimestamp() });
  }
};