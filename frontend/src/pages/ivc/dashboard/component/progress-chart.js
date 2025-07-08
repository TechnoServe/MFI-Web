import React, {useEffect, useState} from 'react';
import propTypes from 'prop-types';
import '../progress.css';

const ProgressChart = ({size, range}) => {
  const [width, setWidth] = useState(null);
  const [width2, setWidth2] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setWidth(`${size}%`);
      setWidth2(`${range}%`);
    }, 1000);
  }, [size, range]);

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
