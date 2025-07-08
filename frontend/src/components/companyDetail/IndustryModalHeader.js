import React from 'react';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';
import propTypes from 'prop-types';
import 'styles/normalize.css';

/**
 * Header component for industry modal, displaying the title and associated product name.
 *
 * @param {Object} props - Component props.
 * @param {string} props.title - The header title for the modal.
 * @param {string} props.product - The name of the product being evaluated.
 * @returns {JSX.Element} A styled header section for the modal.
 */
const IndustryModalHeader = ({title, product}) => {
  // Render modal header with title and product name in a styled layout
  return (
    <div className="flex-row-middle flex-space-between padding-5 background-color-white sticky-top-0">
      <div>
        <h6 className="margin-bottom-0 weight-medium margin-bottom-1"> {title}</h6>
        <div className="text-small text-color-body-text"> {product} </div>
      </div>
    </div>
  );
};

IndustryModalHeader.propTypes = {
  title: propTypes.string,
  product: propTypes.string
};

export default IndustryModalHeader;

