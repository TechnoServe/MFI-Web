import {PROTECTED_PATHS} from 'common';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import SideBar from 'components/side-bar';
import React from 'react';
import {SearchProvider} from 'context/searchContext/search.context';

/**
 * Renders the authenticated IVC section with protected routes and sidebar.
 * Wraps IVC routes in a SearchProvider context and redirects all other routes to the company index.
 *
 * @returns {JSX.Element} The IVC interface with protected route and default redirect.
 */
const {IVC, COMPANIES_INDEX} = PROTECTED_PATHS;
const AuthenticatedIVC = () => {
  // Sets up client-side routing for the authenticated IVC interface
  return (
    <BrowserRouter>
      <Switch>
        {/* Provides search context for IVC routes and sidebar components */}
        <SearchProvider>
          {/* Protected route for IVC section, renders the sidebar */}
          <Route path={IVC}>
            <SideBar />
          </Route>
        </SearchProvider>
        {/* Redirects any unmatched route to the IVC company index */}
        <Redirect from="/*" to={`${IVC}/${COMPANIES_INDEX}`} />
      </Switch>
    </BrowserRouter>
  );
};

export default AuthenticatedIVC;
