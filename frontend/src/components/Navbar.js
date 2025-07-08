import React from 'react';
import styled from '@emotion/styled';
import {FaBars} from 'react-icons/fa';
import {useMediaQuery} from '@chakra-ui/react';
import PropTypes from 'prop-types';

/**
 * Navigation bar component with a sidebar toggle button and page title.
 * Hides itself on specific routes like 'self-assessment' and 'companylist'.
 *
 * @param {Object} props - React component props.
 * @param {Function} props.showSideBar - Function to toggle the sidebar visibility.
 * @returns {JSX.Element|string} A navigation bar element or an empty string on excluded routes.
 */
const NavBar = (props) => {
  const {showSideBar} = props;
  // Determine if the screen width is at least 800px (for desktop layout)
  const [mobile] = useMediaQuery('(min-width: 800px)');

  // Hide NavBar on 'self-assessment' or 'companylist' routes; otherwise render nav with sidebar toggle and title
  return window.location.pathname.split('/')[2] === 'self-assessment' || 'companylist' ? (
    ''
  ) : (
    <NavBar.Wrapper className="border-bottom-1px sticky-top-0">
      {/* Sidebar toggle button, hidden if screen is not mobile */}
      <button className={`${mobile ? 'active' : ''}`} onClick={() => showSideBar()}>
        {' '}
        <FaBars />{' '}
      </button>
      <div className="holder">
        {/* Display the current route section title */}
        <h2> {window.location.pathname.split('/')[2]} </h2>
      </div>
    </NavBar.Wrapper>
  );
};
NavBar.Wrapper = styled.nav`
  display: flex;
  align-items: center;
  background-color: #fff;
  padding-top: 26px;
  padding-bottom: 26px;
  padding-left: 40px;
  position: sticky;
  top: 0;
  z-index: 10;
  @media only screen and (max-width: 600px) {
    padding-left: 12px;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .holder {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .logos {
      display: flex;
      margin-right: 1rem;
      svg {
        color: #8a94a6;
        font-size: 1.3rem;
        margin-left: 1rem;
      }
    }
  }
  h2 {
    font-size: 17px;
    line-height: 0;
    text-transform: capitalize;
  }
  button {
    margin-right: 1rem;
    outline: none;
    svg {
      font-size: 1.3rem;
      color: #304762;
    }
  }
  .active {
    display: none !important;
  }
`;

NavBar.propTypes = {
  showSideBar: PropTypes.any,
};

export default NavBar;
