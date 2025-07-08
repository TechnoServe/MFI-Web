import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

/**
 * A protected route wrapper for company users.
 * Only renders the given component if the user is authenticated; otherwise redirects to login.
 *
 * @param {Object} props - Component props.
 * @param {React.Component} props.component - Component to render for the route.
 * @param {boolean} props.authenticated - Whether the user is authenticated.
 * @param {Object} [props.location] - React Router location object for redirect state.
 * @returns {JSX.Element} A Route component with conditional rendering based on authentication.
 */
function CompanyUserRoute(props) {
  const {component: Component, authenticated, ...rest} = props;

  // Conditionally render the protected component or redirect to login
  return (
    <Route
      {...rest}
      render={(props) => {
        // If user is authenticated, render the requested component
        // If not authenticated, redirect to login with original location preserved in state
        if (authenticated) return <Component />;
        return <Redirect to={{pathname: '/login', state: {from: props.location}}} />;
      }}
    />
  );
}

CompanyUserRoute.propTypes = {
  authenticated: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.any,
};

// Map Redux authentication state to props
const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated,
});

export default connect(mapStateToProps)(CompanyUserRoute);
