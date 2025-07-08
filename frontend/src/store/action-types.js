// export const AUTH_LOGIN = 'AUTH_LOGIN';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import {request} from 'common';

/**
 * Action creator to log out the user and clear session state.
 *
 * @returns {Object} Redux action with type 'auth/logout'
 */
export const authLogout = createAction('auth/logout');

/**
 * Action creator to log in a user and store user/token info.
 *
 * @param {Object} user - The authenticated user object
 * @param {string} token - JWT token string
 * @returns {Object} Redux action with user and token in payload
 */
export const authLogin = createAction('auth/login', (user, token) => {
  // Prepare action payload with user and token
  // TODO: Add user to local storage first
  return {
    payload: {
      user,
      token,
    },
  };
});

/**
 * Action creator to set the current authenticated user.
 *
 * @param {Object} user - The user object to set in state
 * @returns {Object} Redux action with user payload
 */
export const authSetUser = createAction('auth/setUser', (user) => {
  // Prepare action payload with user object
  return {
    payload: user,
  };
});

/**
 * Async thunk to fetch authenticated user and related company info.
 *
 * @returns {Promise<Object>} Resolves to enriched user object with company data
 */
export const fetchAuthUserThunk = createAsyncThunk('auth/fetchAuthUserThunk', async () => {
  // Fetch authenticated user details
  const {data: user} = await request(true).get('me');
  // Fetch associated company info using user's company ID
  const {
    data: {company},
  } = await request(true).get('company/details', {
    params: {'company-id': user.company_user.company_id},
  });
  // Attach company info to user object
  user.company = company;
  // Return enriched user data
  return user;
});
