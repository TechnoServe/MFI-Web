import {PROTECTED_PATHS} from 'common';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import SideBar from 'components/side-bar';
import React from 'react';
import {SearchProvider} from 'context/searchContext/search.context';

const {ADMIN} = PROTECTED_PATHS;
/**
 * Renders the authenticated admin section with routing and sidebar.
 * Wraps admin routes in a SearchProvider context.
 *
 * @returns {JSX.Element} The admin interface with protected route and redirect logic.
 */
const AuthenticatedAdmin = () => {
  return (
    <BrowserRouter>
      <Switch>
        // Provides search context for components within admin routes
        <SearchProvider>
          // Protected admin route that renders the sidebar layout
          <Route path={ADMIN}>
            <SideBar />
          </Route>
        </SearchProvider>

        // Redirects all unknown paths to the admin route
        <Redirect from="/*" to={ADMIN} />
      </Switch>
    </BrowserRouter>
  );
};

export default AuthenticatedAdmin;
