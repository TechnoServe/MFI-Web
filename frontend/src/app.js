import AuthenticatedCompany from 'app/authenticated-company';
import AuthenticatedAdmin from 'app/authenticate-admin';
import UnAuthenticatedApp from 'app/unauthenticated-file';
import AuthenticatedIVC from 'app/authenticated-ivc';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// import Loader from 'components/circular-loader';
import {fetchAuthUserThunk} from 'store/action-types';
import {Flex, Spinner} from '@chakra-ui/react';

/**
 * Main application component that manages authentication flow and renders
 * different views based on the user type (company, ivc, admin) or unauthenticated state.
 *
 * @returns {JSX.Element} The appropriate React component based on authentication status and user type
 */
const App = () => {
  const dispatch = useDispatch();
  // State to track whether the user is authenticated
  const [authenticated, setAuthenticated] = useState(false);
  // State to indicate if the application is loading initial data
  const [loading, setLoading] = useState(true);
  // State to store the user type (e.g., 'company', 'ivc', 'admin')
  const [value, setValue] = useState(null);
  // const [checkStatus, setCheckingStatus] = useState(true);
  // Get authentication status from the Redux store
  const isAuthenticated = useSelector((state) => state.auth.authenticated);
  // Get user object from the Redux store
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // When authentication status changes, fetch user data if authenticated
    // Set user type and update loading state once user data is available
    setAuthenticated(isAuthenticated);
    isAuthenticated && dispatch(fetchAuthUserThunk());
    if (user?.user_type) {
      setValue(user?.user_type?.value);
      setLoading(false);
    }
    // setCheckingStatus(false);
    setLoading(false);
  }, [isAuthenticated]);

  // Show a full-page spinner while the app is still loading
  if (loading) {
    return (
      <Flex height="100vh" justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    );
  }

  // Render the appropriate authenticated view based on user type
  if (authenticated) {
    return value === 'company' ? (
      <AuthenticatedCompany />
    ) : value === 'ivc' ? (
      <AuthenticatedIVC />
    ) : (
      <AuthenticatedAdmin />
    );
  } else {
    // If not authenticated, render the public unauthenticated app
    return <UnAuthenticatedApp />;
  }
};

export default App;
