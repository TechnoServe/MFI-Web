import React, {useState} from 'react';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';
import 'styles/normalize.css';
import propTypes from 'prop-types';
import {Box} from '@chakra-ui/react';

/**
 * Renders a form section for an industry category, showing name, description,
 * and allowing input of a score to calculate the weighted result.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - Name of the industry category.
 * @param {string} props.description - Description of the category.
 * @param {number} props.weight - Weight percentage used to calculate the weighted score.
 * @returns {JSX.Element} A styled form layout displaying weight and user input for score.
 */
const IndustryCategories = ({name, description, weight}) => {
  // State to store the input score entered by the user
  const [weightedScore, setWeightedScore] = useState(0);
  return (

    <Box fontFamily="DM Sans">
      <div className="padding-bottom-6 border-bottom-1px w-form">
        <form>
          <div className="text-base weight-medium margin-bottom-2">{name}</div>
          <p className="text-small text-color-body-text"> {description}</p>
          <div>
            <div className="w-layout-grid grid-3-columns padding-4 rounded-large background-secondary margin-top-5">
              <div>
                {/* Display readonly weighting percentage field */}
                <label htmlFor="email-4" className="form-label small">Weighting(%)</label>
                <input
                  type="text"
                  className="form-input margin-bottom-0 w-input"
                  disabled
                  maxLength="256"
                  placeholder="20%"
                  value={`${weight}%`}
                />
              </div>
              <div>
                {/* Input field for entering the score */}
                <label htmlFor="email-4" className="form-label small">Scores</label>
                <input
                  type="text"
                  className="form-input margin-bottom-0 w-input"
                  maxLength="256"
                  placeholder=""
                  required=""
                  onChange={(e) => setWeightedScore(e.target.value)}
                />
              </div>
              <div>
                {/* Display calculated weighted score (score * weight / 100) */}
                <label htmlFor="email-4" className="form-label small">Weighted</label>
                <input
                  type="text"
                  className="form-input margin-bottom-0 w-input"
                  disabled
                  placeholder="20%"
                  required=""
                  value={`${weightedScore * weight / 100}%`}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Box>
  );
};

IndustryCategories.propTypes = {
  name: propTypes.string,
  description: propTypes.string,
  weight: propTypes.any,
};


export default IndustryCategories;
