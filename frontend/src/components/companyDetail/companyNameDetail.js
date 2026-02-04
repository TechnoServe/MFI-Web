import React from 'react';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';
import propTypes from 'prop-types';
import 'styles/normalize.css';


/**
 * Displays the company name, brand name, and brand tier in a styled card layout.
 *
 * @param {Object} props - Component props.
 * @param {string} props.companyName - Name of the company.
 * @param {string} props.brandName - Name of the product brand.
 * @param {string|number} props.brandTier - Tier level assigned to the brand.
 * @returns {JSX.Element} A styled component showing company and brand details.
 */
const CompanyNameCard = ({companyName, brandName, brandTier}) => {
  // Container for the company and brand display with responsive layout
  return (
    <div className="flex-row-middle flex-align-baseline width-full tablet-flex-column">
      <div className="flex-child-grow width-64 tablet-margin-bottom-2">
        {/* Display the company name in uppercase styling */}
        <div className="weight-medium text-color-1 uppercase">{companyName}</div>
        {/* Row containing brand name and tier information */}
        <div className="flex-row">
          <div className="text-xs margin-right-2">{brandName}</div>
          <div className="text-xs margin-right-2">Tier {brandTier}</div>
        </div>
      </div>
    </div>
  );
};

CompanyNameCard.propTypes = {
  companyName: propTypes.any,
  brandName: propTypes.any,
  brandTier: propTypes.any,
};

export default CompanyNameCard;
