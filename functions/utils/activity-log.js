const {ACTIVITY_LOG_ACTIONS} = require('../constants');

/**
 * optional fields for raw activity logs
 * @type {Array<String>}
 */
const optional = ['subject_id', 'subject_type', 'entity_id', 'entity_type', 'description'];

/**
 * required fields for raw activity logs
 * @type {Array<String>}
 */
const required = ['company_id', 'user_id', 'action'];

/**
 * Activity log
 */
module.exports.ActivityLog = class {
  /**
   * constructor
   * @param {Object} activity
   * @param {String} activity.id
   * @param {String} activity.user_id
   * @param {String} activity.company_id company where the performer of the action belongs
   * @param {String} activity.action
   * @param {String} activity.subject_id
   * @param {String} activity.subject_type
   * @param {String} activity.entity_id
   * @param {String} activity.entity_type
   * @param {Date} activity.created_at a js date object type is returned to the client
   * instead of an object containing seconds and nanoseconds
   */
  constructor(activity = {}) {
    this.activity = activity;
  }

  /**
   * validate function
   * @returns
   */
  validate() {
    const isEmpty = (key) => this.activity[key] == null;
    // validate required fields
    const errors = [];
    required.forEach((key) => {
      if (isEmpty(key)) errors.push(`field ${key} is required`);
    });
    if (errors.length) throw new Error(errors.join(', '));

    const validated = {};
    // pick only defined and allowed fields
    const allowed = [...optional, ...required];
    Object.keys(this.activity).forEach((key) => {
      if (allowed.includes(key)) {
        if (!isEmpty(key)) validated[key] = this.activity[key];
      }
    });
    return validated;
  }

  /**
   * save function
   * @param {*} datastore
   */
  async save(datastore) {
    const activity = this.validate();
    await datastore.saveActivityLog(activity);
  }

  /**
   * process raw activity log to a format that has meaning to the user
   */
  async processRawActivityLog(store) {
    const {user_id: userId, ...rest} = this.activity;
    switch (this.activity.action) {
      case ACTIVITY_LOG_ACTIONS.LOGGED_IN: {
        const user = await store.getUserByUid(userId);
        if (!user) return null;
        // this can be composed as: <action_owner_name>(action_owner_id) <action> at [formatted](<created_at>)
        return {
          action: rest.action,
          action_owner_id: userId,
          action_owner_name: user.full_name,
          action_owner_email: user.email,
          created_at: rest.created_at,
        };
      }
      case ACTIVITY_LOG_ACTIONS.INVITED_TEAM_MEMBERS: {
        return null;
      }
      case ACTIVITY_LOG_ACTIONS.SENT_SUBMISSION: {
        return null;
      }
      case ACTIVITY_LOG_ACTIONS.UPLOADED_EVIDENCE: {
        return null;
      }
      default: {
        throw new Error('unsupported action type');
      }
    }
  }
};
