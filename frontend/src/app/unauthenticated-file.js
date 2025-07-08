import React from 'react';

import LandingPage from 'pages/Landing/index';
import PublicIndex from 'pages/landing2';
import LoginPage from 'pages/login';
import SignUpPage from 'pages/sign-up';
import VerifyToken from 'pages/verify-token';
import IvcAssessment from '../pages/ivc/self-assessment/index';
import PropTypes from 'prop-types';
import MembersAcceptingInvite from 'pages/members-accepting-invites';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import AdminsAcceptingInvite from 'pages/admin-accepting-invites';

/**
 * Defines the public-facing routes for unauthenticated users.
 * Provides landing, login, signup, invite, and token verification paths.
 *
 * @returns {JSX.Element} Router component rendering public pages based on route.
 */
const UnAuthenticatedApp = () => {
  // Sets up browser-based routing for public routes
  return (
    <BrowserRouter>
      {/* Switch through the defined unauthenticated routes */}
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/public-index" exact component={PublicIndex} />
        <Route path="/sign-up" exact component={SignUpPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/ivc/companies-index" exact component={IvcAssessment} />
        <Route path="/invite/:token" exact component={MembersAcceptingInvite} />
        <Route path="/admin-invite/:token" exact component={AdminsAcceptingInvite} />
        <Route path="/verify-token" exact component={VerifyToken} />
        {/* Redirect any unmatched route to the login page */}
        <Redirect from="/*" to="/login" />
      </Switch>
    </BrowserRouter>
  );
};

UnAuthenticatedApp.propTypes = {
  location: PropTypes.any,
};

export default UnAuthenticatedApp;
