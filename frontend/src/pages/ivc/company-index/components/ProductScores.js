import React from 'react';
import propTypes from 'prop-types';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';
import 'styles/normalize.css';

const ProductScoreCard = ({status, product}) => {
  return (
    <div className="flex flex-row-middle flex-align-baseline width-full tablet-flex-column">
      <div className="flex-child-grow tablet-width-full">
        <div className="width-full">
          <div className="flex-justify-end margin-bottom-4 items-center tablet-width-full portrait-flex-justify-start">
            <div className="text-small margin-right-4 flex-child-grow portrait-width-full portrait-margin-right-0">
              {product}
            </div>
            <div className="margin-right-4 flex flex-column">
              <div className="text-small text-color-blue weight-medium">{status}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductScoreCard.propTypes = {
  status: propTypes.string,
  product: propTypes.string,
};

export default ProductScoreCard;
