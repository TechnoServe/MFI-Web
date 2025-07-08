import {useSelector} from 'react-redux';

/**
 * Custom React hook that retrieves user authentication information from Redux state.
 *
 * @returns {Object} Object containing:
 *   - user: Current authenticated user object from Redux store.
 *   - isAuthenticated: Boolean indicating if the user is authenticated.
 */
export const useAuth = () => {
  // Extract user and authentication status from Redux auth state
  const {user, authenticated} = useSelector((state) => state.auth);

  // Return the user object and authentication flag
  return {
    user,
    isAuthenticated: authenticated,
  };
};
