import {authLogin, authSetUser, fetchAuthUserThunk, authLogout} from 'store/action-types';
import jwt from 'jwt-decode';

/**
 * Authentication reducer function that handles login, logout,
 * setting user data, and restoring session from storage.
 *
 * @param {Object} state - Current Redux state
 * @param {Object} action - Redux action dispatched
 * @returns {Object} New state based on action type
 */
function r(state = {authenticated: false}, action) {
  switch (action.type) {
    // Handle login: store token and user info in sessionStorage
    case authLogin.type:
      sessionStorage.setItem('auth-token', action.payload.token);
      sessionStorage.setItem('auth-user', JSON.stringify(action.payload.user));
      return {
        ...state,
        authenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    // Handle logout: remove token and user info from sessionStorage
    case authLogout.type:
      sessionStorage.removeItem('auth-token');
      sessionStorage.removeItem('auth-user');
      return {
        ...state,
        authenticated: false,
      };
    // Update state with fetched or explicitly set user data
    case fetchAuthUserThunk.fulfilled.type:
    case authSetUser.type:
      sessionStorage.setItem('auth-user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };

    // Default case: check for token in sessionStorage to restore session
    default:
      const token = sessionStorage.getItem('auth-token');
      const user = sessionStorage.getItem('auth-user');
      if (token) {
        const decoded = jwt(token);
        // Ensure token hasn't expired before restoring authentication state
        if (new Date() < new Date(decoded.exp * 1000)) {
          return {
            ...state,
            authenticated: true,
            user: JSON.parse(user),
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
  }
}

export default r;
