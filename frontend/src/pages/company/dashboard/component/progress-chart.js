import React, {useEffect, useState} from 'react';
import propTypes from 'prop-types';
import '../progress.css';

/**
 * ProgressChart component renders two animated horizontal progress bars.
 * It uses the `size` and `range` props to set the final width of each bar after a 1-second delay.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.size - Percentage width for the first progress bar
 * @param {number} props.range - Percentage width for the second progress bar
 * @returns {JSX.Element} Two layered progress bars with animated widths
 */
const ProgressChart = ({size, range}) => {
  // State to store width of the first progress bar
  const [width, setWidth] = useState(null);
  // State to store width of the second progress bar
  const [width2, setWidth2] = useState(null);

  useEffect(() => {
    // Delay updating the bar widths by 1 second for animation effect
    setTimeout(() => {
      setWidth(`${size}%`);
      setWidth2(`${range}%`);
    }, 1000);
  }, [size, range]);

  return (
    // Outer container for the progress bars
    <div className="progress-bar">
      {/* First progress bar using width state */}
      <div style={{width}} className="progress"></div>
      {/* Second progress bar using width2 state */}
      <div style={{width: width2}} className="progress2"></div>
    </div>
  );
};

ProgressChart.propTypes = {
  size: propTypes.number,
  range: propTypes.number,
};

export default ProgressChart;
