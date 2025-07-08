/**
 * Firestore collection names used across the backend.
 * These are PascalCased and pluralized for consistency.
 * @readonly
 * @type {Object<string, string>}
 */
module.exports.COLLECTIONS = {
  // Collection for user documents
  USERS: 'Users',
  // Collection for company-user relationships
  COMPANY_USERS: 'CompanyUsers',
  // Collection for MFI admin users
  MFI_ADMINS: 'MfiAdmins',
  // Collection for participating companies
  PARTICIPATING_COMPANIES: 'ParticipatingCompanies',
  // Collection for predefined company sizes
  COMPANY_SIZES: 'CompanySizes',
  // Collection for food vehicle product types
  FOOD_VEHICLES: 'ProductTypes',
  PRODUCT_MICRO_NUTRIENTS: 'ProductMicroNutrient',
  MICRO_NUTRIENTS_SCORES: 'MicroNutrientScores',
  PRODUCT_TESTING: 'ProductTesting',
  MICRO_NUTRIENTS: 'MicroNutrients',
  COMPANY_INVITATIONS: 'CompanyInvitations',
  ADMIN_INVITATIONS: 'AdminInvitations',
  USER_TYPES: 'UserTypes',
  COMPANY_ROLES: 'CompanyRoles',
  ADMIN_ROLES: 'AdminRoles',
  ADMIN_USERS: 'AdminUsers',
  ACTIVITY_LOGS: 'ActivityLogs',
  QUESTION_CATEGORIES: 'QuestionCategories',
  QUESTIONS: 'SAQuestion', // TODO: it should change to plural on firebase
  COMMENTS: 'Comments',
  DOCUMENTS: 'Documents',
  SA_CYCLES: 'SACycles',
  SA_ANSWERS: 'SAAnswers',
  IVC_ANSWERS: 'IVCAnswers',
  QUESTION_TIERS: 'QuestionTiers',
  COMPANY_BRANDS: 'CompanyBrands',
  COMPUTED_ASSESSMENT_SCORES: 'ComputedAssessmentScores',
  ASSESSMENT_SCORES: 'AssessmentScores',
  ALLOTATIONS: 'Allotations',
};

/**
 * Role types for Participating Companies (PC).
 * @readonly
 * @type {Object<string, string>}
 */
module.exports.PC_ROLES = {
  ADMIN: 'pc_admin',
  USER: 'user',
};

/**
 * Role types used internally by TNS/MFI admins.
 * @readonly
 * @type {Object<string, string>}
 */
module.exports.TNS_ROLES = {
  NUCLEAR_ADMIN: 'nuclear_admin',
  ADMIN: 'admin',
  SUPER: 'super',
  BASIC: 'basic',
  IVC_ADMIN: 'ivc_admin',
  IVC: 'ivc',
};

/**
 * User type definitions for the system.
 * @readonly
 * @type {Object<string, string>}
 */
module.exports.USER_TYPES = {
  PARTICIPATING_COMPANY: 'company',
  MFI_INTERNAL_STAKEHOLDER: 'mfi_internal_stakeholder',
  ADMIN: 'admin',
  PUBLIC: 'general_public',
};

/**
 * Actions that are logged in the activity log.
 * @readonly
 * @type {Object<string, string>}
 */
module.exports.ACTIVITY_LOG_ACTIONS = {
  LOGGED_IN: 'logged in',
  INVITED_TEAM_MEMBERS: 'invited team members',
  UPLOADED_EVIDENCE: 'uploaded evidence',
  SENT_SUBMISSION: 'sent submission',
};

/**
 * Types of entities that can own comments/documents.
 * @readonly
 * @type {Object<string, string>}
 */
module.exports.OWNER_TYPES = {
  QUESTION: 'question',
  CATEGORY: 'category',
};

/**
 * Tier levels for companies used in SAT scoring.
 * @readonly
 * @type {Object<string, string>}
 */
module.exports.COMPANY_TIERS = {
  TIER_1: 'TIER_1',
  TIER_3: 'TIER_3',
};

/**
 * Possible SAT response levels for assessment questions.
 * @readonly
 * @type {Object<string, string>}
 */
module.exports.SAT_RESPONSES = {
  NOT_MET: 'NOT_MET',
  PARTLY_MET: 'PARTLY_MET',
  MOSTLY_MET: 'MOSTLY_MET',
  FULLY_MET: 'FULLY_MET',
};

/**
 * Firebase Storage bucket paths.
 * @readonly
 * @type {Object<string, string>}
 */
module.exports.BUCKETS = {
  COMPANIES_LOGO: 'companies/logos/'
};

/**
 * Scoring weight indexes for SAT tiers and response levels.
 * @readonly
 * @type {Object<string, number>}
 */
module.exports.SAT_SCORING_INDEX = {
  MAX_POINTS: 10,
  TIER_1: 0.60,
  TIER_2: 0.25,
  TIER_3: 0.15,
  NOT_MET: 0.15,
  PARTLY_MET: 0.54,
  MOSTLY_MET: 0.75,
  FULLY_MET: 1.00,
};

/**
 * Precomputed SAT score weights for each combination of tier and response.
 * Uses MAX_POINTS × Tier Weight × Response Weight.
 * @readonly
 * @type {Object<string, Object<string, number>>}
 */
module.exports.SAT_SCORES = {
  TIER_1: {
    NOT_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_1'] * this.SAT_SCORING_INDEX['NOT_MET'],
    PARTLY_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_1'] * this.SAT_SCORING_INDEX['NOT_MET'],
    MOSTLY_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_1'] * this.SAT_SCORING_INDEX['MOSTLY_MET'],
    FULLY_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_1'] * this.SAT_SCORING_INDEX['FULLY_MET'],
  },
  TIER_2: {
    NOT_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_2'] * this.SAT_SCORING_INDEX['NOT_MET'],
    PARTLY_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_2'] * this.SAT_SCORING_INDEX['NOT_MET'],
    MOSTLY_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_2'] * this.SAT_SCORING_INDEX['MOSTLY_MET'],
    FULLY_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_2'] * this.SAT_SCORING_INDEX['FULLY_MET'],
  },
  TIER_3: {
    NOT_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_3'] * this.SAT_SCORING_INDEX['NOT_MET'],
    PARTLY_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_3'] * this.SAT_SCORING_INDEX['NOT_MET'],
    MOSTLY_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_3'] * this.SAT_SCORING_INDEX['MOSTLY_MET'],
    FULLY_MET: this.SAT_SCORING_INDEX['MAX_POINTS'] * this.SAT_SCORING_INDEX['TIER_3'] * this.SAT_SCORING_INDEX['FULLY_MET'],
  },
};
