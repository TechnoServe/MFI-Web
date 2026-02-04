import {authLogin, authSetUser, fetchAuthUserThunk, authLogout} from 'store/action-types';

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
    case authLogin.type: {
      // Backward-compatible: some legacy flows still provide a token.
      // With Firebase Auth, the API token is obtained from `auth.currentUser.getIdToken()`
      // and injected by the axios interceptor (not stored here).
      if (action.payload?.token) {
        sessionStorage.setItem('auth-token', action.payload.token);
      }
      if (action.payload?.user) {
        sessionStorage.setItem('auth-user', JSON.stringify(action.payload.user));
      }
      return {
        ...state,
        authenticated: true,
        user: action.payload?.user,
        token: action.payload?.token,
      };
    }
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
    default: {
      const token = sessionStorage.getItem('auth-token');
      const userStr = sessionStorage.getItem('auth-user');

      // If we have a stored user, we can restore authenticated UI state.
      // The real API auth token is injected by axios (Firebase ID token) at request time.
      if (userStr) {
        // Best-effort: if a legacy token exists and looks like a JWT, try to ensure it isn't expired.
        if (token && token.split('.').length === 3) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            if (payload?.exp && new Date() >= new Date(payload.exp * 1000)) {
              return state;
            }
          } catch (e) {
            // Ignore decode errors and fall back to restoring from user.
          }
        }

        try {
          return {
            ...state,
            authenticated: true,
            user: JSON.parse(userStr),
          };
        } catch (e) {
          return state;
        }
      }

      // Legacy fallback: token exists but no user stored
      if (token) {
        return {
          ...state,
          authenticated: true,
        };
      }

      return state;
    }
  }
}

export default r;
