import React, {useEffect, useState} from 'react';
import propTypes from 'prop-types';
import '../progress.css';

/**
 * ProgressChart component renders two animated progress bars based on percentage values.
 * The first bar is fixed at 10%, while the second bar reflects the `range` prop value.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.size - The width percentage for the first animated bar (unused in render)
 * @param {number} props.range - The width percentage for the second progress bar
 * @returns {JSX.Element} A visual progress bar UI with two sections
 */
const ProgressChart = ({size, range}) => {
  // State for the width of the first progress bar (currently unused in render)
  const [width, setWidth] = useState(null);
  // State for the width of the second progress bar
  const [width2, setWidth2] = useState(null);

  useEffect(() => {
    // Animate the width of both bars after a 1 second delay
    setTimeout(() => {
      setWidth(`${size}%`);
      setWidth2(`${range}%`);
    }, 1000);
  }, [size, range]);


  // Render two divs representing progress bars with their respective widths
  return (
    <div className="progress-bar">
      <div style={{width: '10%'}} className="progress"></div>
      <div style={{width: width2}} className="progress2"></div>
    </div>
  );
};

ProgressChart.propTypes = {
  size: propTypes.number,
  range: propTypes.number,
};

export default ProgressChart;
