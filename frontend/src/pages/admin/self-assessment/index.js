import React from 'react';
import Categories from './categories';
import proptypes from 'prop-types';
import {Switch, useRouteMatch, Route, Redirect} from 'react-router-dom';
import {nanoid} from '@reduxjs/toolkit';
import Home from './pages/home';
import ComingSoon from 'components/coming-soon';
import {Flex, Stack} from '@chakra-ui/react';

const assessmentRoute = [
  { path: '', exact: true, page: Home },
  { path: 'hello', exact: true, page: ComingSoon },
];
/**
 * Renders the self-assessment admin page layout including sidebar categories
 * and dynamically routed content pages (e.g., Home, Coming Soon).
 *
 * @component
 * @param {Object} props - React component props
 * @param {Function} props.showSideBar - Callback to toggle sidebar visibility
 * @returns {JSX.Element} The complete self-assessment page layout with sidebar and routing
 */
const selfAssessment = ({showSideBar}) => {
  // Get the base path from the current route match
  const {path} = useRouteMatch();
  // Layout: Sidebar on the left, main content area on the right
  return (
    <Flex>
      <Stack className="padding-0 background-color-4 height-viewport-full overflow-scroll sticky-top-0">
        {/* Render the self-assessment category sidebar */}
        <Categories showSideBar={showSideBar} />
      </Stack>
      <Stack flex={1} className="padding-x-0 background-secondary">
        {/* Render dynamic content pages based on route configuration */}
        <Switch>
          {assessmentRoute.map(({page: Component, path: route, exact}) => (
            // Map each route to its corresponding component
            <Route exact={exact} key={nanoid()} path={`${path}/${route}`}>
              <Component showSideBar={() => setIsOpen(true)} />
            </Route>
          ))}

          {/* Redirect unmatched routes to the home page */}
          <Redirect from="/*" to="" />
        </Switch>
      </Stack>
    </Flex>
  );
};

selfAssessment.propTypes = {
  showSideBar: proptypes.any,
};

export default selfAssessment;
