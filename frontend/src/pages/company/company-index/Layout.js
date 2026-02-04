import React from 'react';
import Header from './header';
import proptypes from 'prop-types';


/**
 * PageLayout is a wrapper component for the company index page.
 * It includes a persistent header and renders any child components passed into it.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to be displayed within the layout
 * @returns {JSX.Element} The rendered layout with header and children content
 */
const PageLayout = ({children}) => {
  return (
    <div>
      {/* // Render the page header */}
      <Header/>
      {/* // Render child components passed to this layout */}
      {children}
    </div>
  );
};

PageLayout.propTypes = {
  children: proptypes.any,
};

export default PageLayout;
