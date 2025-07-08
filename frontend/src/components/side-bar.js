import {nanoid} from '@reduxjs/toolkit';
import React, {useEffect, useState} from 'react';
import logout from 'assets/images/Logout.svg';
import ReactSideBar from 'react-sidebar';
import PropTypes from 'prop-types';
import {ADMIN_SUB_ROUTES, IVC_SUB_ROUTES, PROTECTED_PATHS, SUB_ROUTES} from 'common';
import {Stack, useMediaQuery} from '@chakra-ui/react';
import {Switch, useRouteMatch, Route, Redirect, Link} from 'react-router-dom';
import NavBar from './Navbar';
import {isArray} from 'validate.js';
import {useDispatch, useSelector} from 'react-redux';
import {authLogout} from 'store/action-types';
import {companyNavs, ivcNavs, adminNavs} from './constants';
import logo from 'assets/mfilogo.png';

const {DASHBOARD} = PROTECTED_PATHS;

/**
 * Main sidebar component that renders dynamic navigation items based on user role (company, IVC, admin).
 * It includes logo, navigation links, and logout functionality. It also routes to subpages conditionally.
 *
 * @returns {JSX.Element} Sidebar layout with navigation and main content area.
 */
const SideBar = () => {
  const dispatch = useDispatch();
  // Set initial navigation items to company user nav
  const [navBar, setNavBar] = useState(companyNavs);
  // State to track sidebar open/close status on mobile
  const [isOpen, setIsOpen] = useState(false);
  // Determine if screen width is desktop (min-width 800px)
  const [mobile] = useMediaQuery('(min-width: 800px)');
  const user = useSelector((state) => state.auth.user);
  const currentLocation = window.location.pathname;
  const {path} = useRouteMatch();

  // Clears relevant localStorage items and dispatches logout action
  const logoutUser = () => {
    localStorage.removeItem('company');
    localStorage.removeItem('TIER_1');
    localStorage.removeItem('TIER_2');
    localStorage.removeItem('TIER_3');
    localStorage.removeItem('mfi');
    dispatch(authLogout());
  };
  // Dynamically update navigation items based on user role
  useEffect(() => {
    if (user.user_type.value === 'company') {
      setNavBar(companyNavs.filter((val) => val.name !== 'companies-index'));
    } else if (user.admin_user.role.value === 'ivc') {
      setNavBar(ivcNavs);
    } else if (user.user_type.value === 'admin') {
      setNavBar(adminNavs);
    }
  }, [user]);

  return (
    <ReactSideBar
      // Render the sidebar contents: logo, navigation items, logout
      sidebar={
        <>
          <div className="w-row">
            <div className="padding-y-6 padding-x-6">
              <img src={logo} loading="lazy" width="200" alt="" className="margin-right-4" />
            </div>

            {navBar.map((item) =>
              // Render nav items conditionally depending on role and item structure (single or grouped)
              !isArray(item) ? (
                <Link
                  key={nanoid()}
                  to={`${path}/${item.to}`}
                  className={`padding-y-4 padding-x-4 flex-space-between flex-row-middle b-tab-menu ${currentLocation.includes(item.name) && 'background-color-4'
                  }`}
                >
                  <div className="flex-row-middle b-tab-link">
                    <img
                      src={currentLocation.includes(item.name) ? item.icon2 : item.icon}
                      loading="lazy"
                      alt=""
                    />
                    <div
                      className={`${currentLocation.includes(item.name) ? 'text-color-1' : 'text-color-4 '
                      } padding-left-4`}
                      style={{
                        textTransform: 'capitalize',
                        fontSize: 16,
                        fontFamily: 'DM Sans',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: '21px',
                        letterSpacing: '0px',
                        textAlign: 'left',
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                  {item.notification && (
                    <div className="div-block padding-x-2 rounded-full">
                      <div className="text-color-4 text-small">{item.notification}</div>
                    </div>
                  )}
                </Link>
              ) : path === '/company' ? (
                <Link
                  key={nanoid()}
                  to={`${path}/${item[0].to}`}
                  className={`padding-y-4 padding-x-4 flex-space-between flex-row-middle b-tab-menu ${currentLocation.includes(item[0].name) && 'background-color-4'
                  }`}
                >
                  <div className="flex-row-middle b-tab-link">
                    <img
                      src={currentLocation.includes(item[0].name) ? item[0].icon2 : item[0].icon}
                      loading="lazy"
                      alt=""
                    />
                    <div
                      className={`${currentLocation.includes(item[0].name) ? 'text-color-1' : 'text-color-4 '
                      } padding-left-4`}
                      style={{
                        textTransform: 'capitalize',
                        fontSize: 16,
                        fontFamily: 'DM Sans',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: '21px',
                        letterSpacing: '0px',
                        textAlign: 'left',
                      }}
                    >
                      {item[0].name}
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  key={nanoid()}
                  to={`${path}/${item[1].to}`}
                  className={`padding-y-4 padding-x-4 flex-space-between flex-row-middle b-tab-menu ${currentLocation.includes(item[1].name) && 'background-color-4'
                  }`}
                >
                  <div className="flex-row-middle b-tab-link">
                    <img src={item[1].icon} loading="lazy" alt="" />
                    <div
                      className={`${currentLocation.includes(item[1].name) ? 'text-color-1' : 'text-color-4 '
                      } padding-left-4`}
                      style={{
                        textTransform: 'capitalize',
                        fontSize: 16,
                        fontFamily: 'DM Sans',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: '21px',
                        letterSpacing: '0px',
                        textAlign: 'left',
                      }}
                    >
                      {item[1].name}
                    </div>
                  </div>
                </Link>
              )
            )}
            {/* Logout button at bottom of sidebar */}
            <Stack
              onClick={logoutUser}
              _hover={{background: 'gray', cursor: 'pointer'}}
              className="absolute-bottom margin-bottom-20 cursor-click"
            >
              <div className="padding-y-4 padding-x-4 flex-row-middle">
                <div className="flex-row-middle">
                  <img src={logout} loading="lazy" alt="" />
                  <div className="text-color-4 padding-left-4">Logout</div>
                </div>
              </div>
            </Stack>
          </div>
        </>
      }
      open={isOpen}
      onSetOpen={() => setIsOpen(false)}
      docked={mobile}
      shadow={false}
      styles={{
        sidebar: {background: '#1e1f24', width: 240},
        root: {height: '100vh'},
      }}
    >
      <div className="padding-0 background-color-4" style={{height: '100vh'}}>
        <NavBar showSideBar={() => setIsOpen(true)} />
        {/* Route switching logic: load pages based on user role */}
        <Switch>
          {user.user_type.value === 'ivc'
            ? IVC_SUB_ROUTES.map(({page: Component, path: route, exact}) => (
              <Route exact={exact} key={nanoid()} path={`${path}/${route}`}>
                <Component showSideBar={() => setIsOpen(true)} />
              </Route>
            ))
            : user.user_type.value === 'admin'
              ? ADMIN_SUB_ROUTES.map(({page: Component, path: route, exact}) => (
                <Route exact={exact} key={nanoid()} path={`${path}/${route}`}>
                  <Component showSideBar={() => setIsOpen(true)} />
                </Route>
              ))
              : SUB_ROUTES.map(({page: Component, path: route, exact}) => (
                <Route exact={exact} key={nanoid()} path={`${path}/${route}`}>
                  <Component showSideBar={() => setIsOpen(true)} />
                </Route>
              ))}

          {/* Fallback route redirects to dashboard */}
          <Route exact path="/*">
            <Redirect to={`${path}/${DASHBOARD}`} />
          </Route>
        </Switch>
      </div>
    </ReactSideBar>
  );
};

SideBar.propTypes = {
  screen: PropTypes.number,
};

export default SideBar;
