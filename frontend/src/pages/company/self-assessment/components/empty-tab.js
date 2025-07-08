import React from 'react';
import {Flex} from '@chakra-ui/react';
import propTypes from 'prop-types';
import Introduction from './introduction';
import ContinueView from './continue';
import {isNumber} from 'validate.js';

/**
 * EmptyTab component conditionally renders either an introduction view or a continuation view
 * based on the presence of numeric progress data.
 *
 * @component
 * @param {Object} props - Component props
 * @param {any} props.progress - The current progress value, expected to be a number or undefined
 * @param {Function} props.getCompanyDetails - Callback function to retrieve company details
 * @returns {JSX.Element} Rendered view based on user progress (introduction or continue)
 */
const EmptyTab = ({progress, getCompanyDetails}) => {
  // Conditionally render ContinueView or Introduction based on whether progress is a number
  return (
    <div style={{width: '100%'}}>
      {/* Empty top bar for layout padding or spacing */}
      <div className="flex-row-middle flex-space-between padding-x-10 padding-y-4 border-bottom-0px height-20 background-color-white sticky-top-0"></div>
      {/* Centered content area rendering either the introduction or continue view */}
      <Flex bg="white" justifyContent="center" alignItems="center" height="100%">
        {/* Render ContinueView if progress is a number, otherwise render Introduction */}
        {isNumber(progress) ? (
          <ContinueView />
        ) : (
          <Introduction getCompanyDetails={getCompanyDetails} />
        )}
      </Flex>
    </div>
  );
};

EmptyTab.propTypes = {
  progress: propTypes.any,
  getCompanyDetails: propTypes.any,
};
export default EmptyTab;
