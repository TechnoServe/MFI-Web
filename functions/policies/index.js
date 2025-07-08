const SUPER = 'F4UNfg4iRCZRKJGZpbvv';
const NUCLEAR = 'sHM61QwGajJMNUPYxTVI';
const BASIC = 'zgDkefjf2EOLxVhH2Hc8';
const IVC = 'l9SHXn44ldl0reoeRqlQ';

const HIGHER_ADMINS = [SUPER, NUCLEAR];

/**
 * Checks if the user ID has permission to approve SAT.
 * @param {string} id - Admin role ID.
 * @returns {boolean} True if the ID is in the HIGHER_ADMINS list.
 */
const canApproveSAT = (id) => HIGHER_ADMINS.includes(id);
/**
 * Checks if the user ID has permission to disapprove SAT.
 * @param {string} id - Admin role ID.
 * @returns {boolean} True if the ID matches the NUCLEAR role.
 */
const canDisapproveSAT = (id) => id === NUCLEAR;
/**
 * Checks if the user ID has permission to replace SAT.
 * @param {string} id - Admin role ID.
 * @returns {boolean} True if the ID is in the HIGHER_ADMINS list.
 */
const canReplaceSAT = canApproveSAT;
/**
 * Checks if the user ID has permission to invite.
 * @param {string} id - Admin role ID.
 * @returns {boolean} True if the ID is in the HIGHER_ADMINS list.
 */
const canInvite = canApproveSAT;
/**
 * Checks if the user ID has permission to set role.
 * @param {string} id - Admin role ID.
 * @returns {boolean} True if the ID is in the HIGHER_ADMINS list.
 */
const canSetRole = canApproveSAT;
/**
 * Checks if the user ID has permission to assign a company.
 * @param {string} id - Admin role ID.
 * @returns {boolean} True if the ID is in the HIGHER_ADMINS list.
 */
const canAssignCompany = canApproveSAT;
/**
 * Checks if the user ID has permission to remove a company from the index.
 * @param {string} id - Admin role ID.
 * @returns {boolean} True if the ID matches the NUCLEAR role.
 */
const canRemoveCompanyFromIndex = canDisapproveSAT;
/**
 * Checks if the user ID has permission to give a company permission to change SAT.
 * @param {string} id - Admin role ID.
 * @returns {boolean} True if the ID matches the NUCLEAR role.
 */
const canGiveCompanyPermissionToChangeSAT = canDisapproveSAT;
/**
 * Checks if the user ID has permission to approve the index.
 * @param {string} id - Admin role ID.
 * @returns {boolean} True if the ID matches the NUCLEAR role.
 */
const canApproveIndex = canDisapproveSAT;

// SAT
// Approve SAT - Nuclear, Super
// Disapprove SAT - Nuclear
// Replace/Update SAT - Nuclear, Super

// Team management
// Invite - Super
// SetRole (limted to Basic, super, and ivc admin roles) - Super
// AssigneCompanyToBasicAdmin - Super

// PUblic Index
// Remove companies from index - Nuclear
// Give permission to make changes to SAT - Nuclear

/**
 * Object representing admin role constants.
 * @typedef {Object} ADMIN_ROLES
 * @property {string} BASIC - Basic admin role.
 * @property {string} NUCLEAR - Nuclear admin role.
 * @property {string} SUPER - Super admin role.
 * @property {string} IVC - IVC admin role.
 */
const ADMIN_ROLES = {
  BASIC, NUCLEAR, SUPER, IVC
};

/**
 * Exports permission functions and role constants.
 */
module.exports = {
  canApproveSAT,
  canAssignCompany,
  canDisapproveSAT,
  canInvite,
  canReplaceSAT,
  canSetRole,
  canRemoveCompanyFromIndex,
  canGiveCompanyPermissionToChangeSAT,
  canApproveIndex,
  ADMIN_ROLES
};
