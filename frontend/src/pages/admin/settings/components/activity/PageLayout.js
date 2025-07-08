import React from 'react';
import Header from './header';
import proptypes from 'prop-types';

/**
 * PageLayout component provides a wrapper for the activity settings page.
 * It renders a common Header and the content passed as children.
 *
 * @component
 * @param {Object} props - React component props
 * @param {React.ReactNode} props.children - Content to be displayed below the header
 * @param {Array} props.activities - Activity data passed to the Header
 * @returns {JSX.Element} The page layout with a header and nested content
 */
const PageLayout = ({children, activities}) => {
  return (
    <div>
      {/* Render the page header with activity data passed as props */}
      <Header activity={activities} />
      {/* Render nested content passed from the parent component */}
      {children}
    </div>
  );
};

PageLayout.propTypes = {
  children: proptypes.any,
  activities: proptypes.any,
};

export default PageLayout;
