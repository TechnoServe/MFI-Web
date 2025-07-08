const {USER_TYPES} = require('../constants');
const {companyAndCycle, adminCanInvite, sendEmail, signJwtToken} = require('../utils');
const {validate} = require('../utils');

/**
 * Approves the SAT score for a specific company and cycle.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.approveSAT = (store) => async (req, res) => {
  const errors = validate(req.query, companyAndCycle);

  const {'company-id': companyId, 'cycle-id': cycleId} = req.query;

  if (errors) return res.status(400).json({errors});

  try {
    await store.approveSAT(companyId, cycleId, req.user.id);
    return res.json({success: 'SAT score approval successful.'});
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'Unable to approve score.'});
  }
};

/**
 * Assigns a company to a user for a specific cycle.
 * @param {boolean} [user] - If true, assigns to the current user; otherwise, uses provided user id.
 * @returns {Function} Function that takes store and returns Express handler function.
 */
const assignCompanyToUser = (user = undefined) => (store) => async (req, res) => {
  const userToAssign = user ? req.user.id : req.body['user-id'];
  const constraints = {...companyAndCycle, 'user-id': {type: 'string', presence: {allowEmpty: false}}};
  const errors = validate({...req.body, 'user-id': userToAssign}, constraints);

  const {'company-id': companyId, 'cycle-id': cycleId} = req.body;

  if (errors) return res.status(400).json({errors});

  try {
    await store.assignCompanyToUser(companyId, userToAssign, cycleId);
    return res.json({success: 'Company successfully assigned.'});
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'Unable to assign company.'});
  }
};

/**
 * Removes a company assignment from an admin.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.removeCompanyFromAdmin = (store) => async (req, res) => {
  const {
    params: {id},
  } = req;

  if (!id) {
    return res.status(400).json({error: 'No company id provided.'});
  }

  if (await store.deleteAssignedCompany(id)) {
    return res.json({success: 'Company successfully removed.'});
  } else {
    return res.status(500).json({error: 'Unable to remove company.'});
  }
};

/**
 * Deletes a user and their associated data.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.deleteUser = (store) => async (req, res) => {
  const {
    params: {id,authId},
  } = req;

  if (!id) {
    return res.status(400).json({error: 'No company id provided.'});
  }

  if (await store.deleteUser(id,authId)) {
    return res.json({success: 'User successfully removed.'});
  } else {
    return res.status(500).json({error: 'Unable to remove user.'});
  }
};

/**
 * Deletes all data related to a specific company.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.deleteCompanyData = (store) => async (req, res) => {
  const {
    params: {id},
  } = req;

  if (!id) {
    return res.status(400).json({error: 'No company id provided.'});
  }

  store.deleteCompanyData(id);
  res.json({success: 'Company successfully removed.'});
};

/**
 * Deletes a micronutrient score for a given participant and micronutrient.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.deleteMicroNutrientScore = (store) => async (req, res) => {
  const {
    params: {ptid,microid},
  } = req;

  if (!ptid) {
    return res.status(400).json({error: 'No micronutrient id provided.'});
  }

  store.deleteMicroNutrientScore(ptid,microid);
  res.json({success: 'Micronutrient score successfully removed.'});
};

/**
 * Assigns a company to the current user (self) for a specific cycle.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.assignCompanyToSelf = assignCompanyToUser(true);
/**
 * Assigns a company to an admin user for a specific cycle.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.assignCompanyToAdmin = assignCompanyToUser();

/**
 * Lists all admin members.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.listMembers = (store) => async (req, res) => {
  try {
    const members = await store.getAdminMembers();
    return res.json(members);
  } catch (e) {
    console.error('admin members error: ', e);
    res.status(500).json({message: e.message});
  }
  //res.status(500).json({message: 'Request not completed'});
};

/**
 * Lists all company members for admin view.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.listCompanyMembers = (store) => async (req, res) => {
  try {
    const members = await store.getCompanyMembersAdmin();
    return res.json(members);
  } catch (e) {
    console.error('company members error: ', e);
  }
  res.status(500).json({message: 'Request not completed'});
};

/**
 * Sends invitations to add new team members to the admin team.
 * @param {Object} store - Data access layer.
 * @param {Object} transport - Email transport object.
 * @returns {Function} Express handler function.
 */
module.exports.inviteTeamMember = (store, transport) => async (req, res) => {
  try {
    const {
      body,
      user: {role}
    } = req;

    const invitationConstraint = {
      'role_id': {
        type: 'string',
        presence: {allowEmpty: false},
      },
      'email': {
        email: true,
        presence: {allowEmpty: false},
      },
    };

    // Joi validator would have being more useful in this context
    const itemValidator = (constraints) => (val) => validate(val, constraints);

    const errors = [];
    if (!Array.isArray(body)) {
      errors.push('Invitation payload must be an array.');
    } else if (!(body.length > 0)) {
      errors.push('Invitation payload cannot be empty.');
    } else {
      errors.concat(
        body.map(itemValidator(invitationConstraint)).filter((err) => err)
      );
    }

    if (errors.filter((err) => err).length > 0) return res.status(400).json({errors});

    for (let index = 0; index < body.length; index++) {
      const {email, role_id: invitedUserRole} = body[index];

      // Check if user exists
      if ((await store.getUserByEmail(email)) || !adminCanInvite(role, invitedUserRole)) {
        continue;
      }

      // Check if an invite already exists
      let invite = await store.getAdminTeamMemberInviteByEmail(email);
      if (invite) {
        const url = `${process.env.FRONTEND_URL || 'localhost:5000'}?admin-invitationId=${invite.id}`;
        await sendEmail(transport, {
          from: process.env.TRANSACTIONAL_EMAIL_ADDRESS,
          to: email,
          subject: 'Invitation',
          html: `<p>Click to Accept Invitation: </p><br/>${url}`,
        });
      }

      // Create new invite
      invite = await store.createAdminTeamMemberInvite(email, {role_id: invitedUserRole});

      const url = `${process.env.FRONTEND_URL || 'localhost:5000'}/admin-invite/${invite.id}`;
      await sendEmail(transport, {
        from: process.env.TRANSACTIONAL_EMAIL_ADDRESS,
        to: email,
        subject: 'Invitation',
        html: `<p>Click to Accept Invitation: </p><br/>${url}`,
      });
    }

    return res.json({message: 'Invitation sent'});
  } catch (e) {
    console.error('invite team member', e);
    res.status(500).json({error: e.message});
  }
};

/**
 * Accepts an admin team member invitation and creates a user account.
 * @param {Object} store - Data access layer.
 * @param {Object} transport - Email transport object.
 * @returns {Function} Express handler function.
 */
module.exports.acceptInvite = (store, transport) => async (req, res) => {
  try {
    const {fullName, invitationId} = req.body;
    const invite = await store.getAdminTeamMemberInviteById(invitationId);

    if (!invite) {
      return res.status(400).json({
        errors: {
          invitationId: ['Invite does not exist.'],
        },
      });
    }

    if (await store.getAuthUserByEmail(invite.email)) {
      return res.status(400).json({
        errors: {
          invitationId: ['User already exists.'],
        },
      });
    }

    const authUser = await store.createAuthUser(invite.email);
    const {id: userTypeId} = await store.getUserTypeByName(USER_TYPES.ADMIN);
    const {id: userId} = await store.createUser({
      full_name: fullName,
      email: invite.email,
      user_type_id: userTypeId,
      auth_provider_id: authUser.uid,
    });

    await store.createAdminUser({
      admin_role_id: invite.role_id,
      user_id: userId,
    });

    const token = await signJwtToken(authUser.uid);
    const url = `${process.env.FRONTEND_URL}/verify-token?token=${token}`;

    sendEmail(transport, {
      from: process.env.TRANSACTIONAL_EMAIL_ADDRESS,
      to: invite.email,
      subject: 'Email Login',
      html: `<a href="${url}">Click to Login: ${url}</a>`,
    });

    return res.json({message: 'Sign up successfull.'});
  } catch (e) {
    console.error('handle accept company invite', e);
    return res.status(500).json({error: e.message});
  }
};

/**
 * Cancels (deletes) an admin team member invitation.
 * @param {Object} store - Data access layer.
 * @param {Object} transport - Email transport object.
 * @returns {Function} Express handler function.
 */
module.exports.cancelInvite = (store, transport) => async (req, res) => {
  try {
    // TODO: Write a guard.
    const {invitationId} = req.body;
    const invite = store.getAdminTeamMemberInviteById(invitationId);

    if (!invite) {
      return res.status(400).json({
        errors: {
          invitationId: ['Invite does not exist.'],
        },
      });
    }

    const user = await store.getUserByEmail(invite.email);

    if (user) {
      return res.status(400).json({
        errors: {
          invitationId: ['User already exists.'],
        },
      });
    }

    if (await store.deleteAdminTeamMemberInvite(invite.id)) {
      return res.json({message: 'Invite deleted.'});
    }

    return res.status(400).json({message: 'Failed to delete invite.'});
  } catch (error) {
    console.error('admin delete team member invite', error);
    return res.status(500).json({message: 'Some error occured while deleting invite.'});
  }
};

/**
 * Retrieves a list of available admin roles.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.getAdminRoles = (store) => async (req, res) => {
  try {
    const members = await store.getAdminRoles();
    return res.json(members);
  } catch (e) {
    console.error('admin members error: ', e);
  }
  res.status(500).json({message: 'Request not completed'});
};

/**
 * Assigns a role to an admin user.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.assignRole = (store) => async (req, res) => {
  const {
    body,
    user: {role}
  } = req;

  const assingContraint = {
    'role_id': {
      type: 'string',
      presence: {allowEmpty: false},
    },
    'user_id': {
      type: 'string',
      presence: {allowEmpty: false},
    }
  };

  const errors = validate(body, assingContraint);

  if (errors) return res.status(400).json({errors});
  const {role_id: roleId, user_id: userId} = body;


  if (!adminCanInvite(role, roleId)) return res.status(401).json({error: 'Unauthorised'});

  try {
    if (!(await store.getAdminUserByUserId(userId))) return res.status(400).json({error: 'User does not exist.'});

    const response = await store.assignRole(userId, roleId);
    if (response) {
      return res.json({success: 'Role assigned successfully.'});
    } else {
      return res.json({success: 'Role assignment failed.'}).status(400);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'Unable to assign role.'});
  }
};

/**
 * Locks the SAT for a specific cycle and date.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.lockSat = (store) => async (req, res) => {
  const {
    body,
  } = req;

  const lockConstraint = {
    'cycle-id': {
      type: 'string',
      presence: {allowEmpty: false},
    },
    'date': {
      type: 'string',
      presence: {allowEmpty: false},
    }
  };

  const errors = validate(body, lockConstraint);

  if (errors) return res.status(400).json({errors});
  const {'cycle-id': cycleId, date} = body;


  try {
    await store.lockSat(cycleId, date);
    return res.json({success: 'SAT locked successfully.'});
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'Unable to lock SAT.'});
  }
};

/**
 * Retrieves the currently active SAT cycle.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.getActiveCycle = (store) => async (req, res) => {
  try {
    const cycle = await store.getActiveSATCycle();
    return res.json(cycle);
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'Unable to get active cycle.'});
  }
};

/**
 * Retrieves all SAT cycles.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.getCycles = (store) => async (req, res) => {
  try {
    const cycle = await store.getCycles();
    return res.json(cycle);
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'Unable to get active cycle.'});
  }
};
/**
 * Sends an email to all members of a specific company or all companies.
 * @param {Object} store - Data access layer.
 * @param {Object} transport - Email transport object.
 * @returns {Function} Express handler function.
 */
module.exports.emailCompany = (store, transport) => async (req, res) => {
  try {
    const {
      body
    } = req;

    const emailConstraints = {
      'company-id': {
        type: 'string',
        presence: { allowEmpty: false },
      },
      'subject': {
        type: 'string',
        presence: { allowEmpty: false },
      },
      'message': {
        type: 'string',
        presence: { allowEmpty: false },
      },
    };

    const errors = validate(body, emailConstraints);

    if (errors) return res.status(400).json({ errors });
    const { 'company-id': companyId, subject, message } = body;

    const companyMembers = companyId == 'ALL' ? (await store.getCompanyMembersAdmin()) : (await store.getCompanyMembers(companyId));

    for (let i = 0; i < companyMembers.length; i++) {
      const companyMember = companyMembers[i];

      await sendEmail(transport, {
        from: process.env.TRANSACTIONAL_EMAIL_ADDRESS,
        to: companyMember.email,
        subject: subject,
        html: message,
      });
    }

    return res.json({ message: 'Email sent' });
  } catch (e) {
    console.error('emailCompany error', e);
    res.status(500).json({ error: e.message });
  }
};

/**
 * Exports SAT data for a specific cycle and company.
 * @param {Object} store - Data access layer.
 * @returns {Function} Express handler function.
 */
module.exports.satExport = (store) => async (req, res) => {
  try {
    const {
      params: { cycle, company },
    } = req;

    if (!cycle) {
      return res.status(400).json({ error: 'No cycle id provided.' });
    }
    if (!company) {
      return res.status(400).json({ error: 'No company id provided.' });
    }
    const satE = store.satExport(cycle, company);
    return res.json(satE);
    //return res.json({ success: 'SAT export successful.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to export SAT.' });
  }
}