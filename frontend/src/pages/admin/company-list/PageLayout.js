import React from 'react';
import Header from './header';
import proptypes from 'prop-types';


/**
 * Layout wrapper for the admin company list page.
 * Renders the page header and any nested child components.
 *
 * @param {Object} props - React component props.
 * @param {React.ReactNode} props.children - Components to render inside the layout.
 * @param {Array|Object} props.companies - Company data passed to the Header component.
 * @returns {JSX.Element} The composed page layout with header and children content.
 */
const PageLayout = ({children, companies}) => {
  return (
    <div>
      {/* Render the Header component with company data */}
      <Header company={companies} />
      {/* Render the nested children inside the layout */}
      {children}
    </div>
  );
};

PageLayout.propTypes = {
  children: proptypes.any,
  companies: proptypes.any,
};

export default PageLayout;
