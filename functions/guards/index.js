const {USER_TYPES} = require('../constants');

/**
 * Checks if the user is a company admin for the specified company.
 * @param {Object} store - The store interface for DB access.
 * @param {Object} user - The user object containing company_user details.
 * @param {string} companyId - The ID of the company.
 * @returns {Promise<boolean>} True if user is a company admin, otherwise false.
 */
module.exports.isCompanyAdmin = async (store, user, companyId) => {
  try {
    const company = await store.getCompanyById(companyId);
    if (!company || !user) return false;

    return user.company_user
    && user.company_user.role
    && user.company_user.company_id == company.id
    && (user.company_user.role.name.toUpperCase() == 'PC_ADMIN');
  } catch (err) {
    console.error('guard.isCompanyAdmin failed.', err);
    return false;
  }
};

/**
 * Checks if the user belongs to the specified company.
 * @param {Object} store - The store interface for DB access.
 * @param {Object} user - The user object containing company_user details.
 * @param {string|Object} companyId - The ID or object of the company.
 * @returns {Promise<boolean>} True if user is a member of the company, otherwise false.
 */
module.exports.isCompanyMember = async (store, user, companyId) => {
  try {
    const company = isObject(companyId) ? companyId : await store.getCompanyById(companyId);

    if (!company || !user) return false;
    return (user.company_user && !user.company_user.deleted_at && user.company_user.company_id == company.id);
  } catch (err) {
    console.error('guard.isCompanyMember failed.', err);
    return false;
  }
};

/**
 * Utility function to check if a value is a non-null object.
 * @param {*} val - The value to check.
 * @returns {boolean} True if val is a non-null object.
 */
const isObject = (val) => typeof val === 'object' && val !== null;

/**
 * Checks if the user is an MFI admin based on user_type and admin_user record.
 * @param {Object} user - The user object containing type and admin info.
 * @returns {boolean} True if user is an MFI admin, otherwise false.
 */
module.exports.isMFIAdmin = (user) => {
  return (
    user.user_type.value.toLowerCase() === USER_TYPES.ADMIN
    && user.admin_user
    && user.admin_user.id
    && user.admin_user
  );
};
