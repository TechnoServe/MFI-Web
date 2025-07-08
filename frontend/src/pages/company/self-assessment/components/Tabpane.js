import React from 'react';
import PropTypes from 'prop-types';

/**
 * TabPane is a simple wrapper component used to group tab content.
 * It renders its child elements when active tab matches.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - The name/label of the tab
 * @param {React.ReactNode} props.children - The content to be rendered within the tab
 * @returns {JSX.Element} Rendered tab content
 */
const TabPane = (props) => {
  // Render the children passed into the TabPane (typically tab content)
  return props.children;
};
TabPane.propTypes = {
  name: PropTypes.string,
  children: PropTypes.any,
};

export default TabPane;
