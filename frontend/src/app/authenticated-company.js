import {PROTECTED_PATHS} from 'common';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import SideBar from 'components/side-bar';
import React from 'react';

const {COMPANY, DASHBOARD} = PROTECTED_PATHS;

/**
 * Renders the authenticated company section with routing and sidebar.
 * Wraps company routes in a protected layout and redirects all other routes to dashboard.
 *
 * @returns {JSX.Element} The company interface with protected route and default redirect.
 */
const AuthenticatedCompany = () => {
  return (
    <BrowserRouter>
      <Switch>
        // Renders the sidebar layout for all company routes
        <Route path={COMPANY}>
          <SideBar />
        </Route>
        // Redirects any undefined route to the company dashboard
        <Redirect from="/*" to={`${COMPANY}/${DASHBOARD}`} />
      </Switch>
    </BrowserRouter>
  );
};

export default AuthenticatedCompany;
