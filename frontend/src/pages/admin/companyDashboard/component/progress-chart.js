import React, {useEffect, useState} from 'react';
import propTypes from 'prop-types';
import '../progress.css';

/**
 * ProgressChart component renders two progress bars with animated width based on props.
 *
 * @param {Object} props - Component props.
 * @param {number} props.size - Percentage width for the first progress bar.
 * @param {number} props.range - Percentage width for the second progress bar.
 * @returns {JSX.Element} A container with two styled progress bars.
 */
const ProgressChart = ({size, range}) => {
  // State for the first progress bar's width
  const [width, setWidth] = useState(null);
  // State for the second progress bar's width
  const [width2, setWidth2] = useState(null);

  useEffect(() => {
    // Set both progress bar widths after a delay of 1 second
    setTimeout(() => {
      setWidth(`${size}%`);
      setWidth2(`${range}%`);
    }, 1000);
  }, [size, range]);

  // Render two divs representing progress bars with their respective widths
  return (
    <div className="progress-bar">
      <div style={{width}} className="progress"></div>
      <div style={{width: width2}} className="progress2"></div>
    </div>
  );
};

ProgressChart.propTypes = {
  size: propTypes.number,
  range: propTypes.number,
};

export default ProgressChart;
