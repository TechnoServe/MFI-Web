import React from 'react';
import PropTypes from 'prop-types';

/**
 * TabPane component serves as a container for rendering content inside a tab.
 * It acts as a simple wrapper that returns its children unchanged.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - Name of the tab
 * @param {React.ReactNode} props.children - Content to be displayed inside the tab pane
 * @returns {React.ReactNode} The children elements passed to the TabPane
 */
const TabPane = (props) => {
  // Render the content provided as children to this tab pane
  return props.children;
};
TabPane.propTypes = {
  name: PropTypes.string,
  children: PropTypes.any,
};

export default TabPane;
