import React from 'react';
import {Flex} from '@chakra-ui/react';
import propTypes from 'prop-types';
import Introduction from './introduction';
import ContinueView from './continue';
import {isNumber} from 'validate.js';

/**
 * EmptyTab component conditionally renders either an Introduction or ContinueView
 * based on whether the user's progress is a number. It is used when a category tab is empty.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number|null} props.progress - Indicates if progress has been made; renders ContinueView if true
 * @param {Function} props.getCompanyDetails - Function to fetch or refresh company data
 * @returns {JSX.Element} Rendered view for an empty assessment tab
 */
const EmptyTab = ({progress, getCompanyDetails}) => {
  return (
    <div style={{width: '100%'}}>
      // Top placeholder row for styling (header or spacing)
      <div className="flex-row-middle flex-space-between padding-x-10 padding-y-4 border-bottom-0px height-20 background-color-white sticky-top-0"></div>
      <Flex bg="white" justifyContent="center" alignItems="center" height="100%">
        // Render ContinueView if user has progress, otherwise show Introduction
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
