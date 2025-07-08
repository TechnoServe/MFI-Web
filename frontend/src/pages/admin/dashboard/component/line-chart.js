import * as React from 'react';
import {Line} from 'react-chartjs-2';

/**
 * CustomLine component renders a line chart representing an industry breakdown across categories.
 *
 * @returns {JSX.Element} A line chart with customized styles and no visible axes.
 */
const CustomLine = () => {
  // Chart data configuration including labels and dataset values
  const data3 = {
    labels: ['Flour', 'Oil', 'Sugar'],
    datasets: [
      {
        label: 'Industry Breakdown',
        data: [13, 5, 3, 2, 9],
        // Background colors and hover style for dataset visualization
        backgroundColor: [
          'rgb(103, 197, 134)',
          'rgb(233, 246, 237)',
          'rgb(169, 222, 186)',
          'rgb(200, 234, 211)',
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Chart configuration options: hide axes and position legend on the right
  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
    responsive: false,
  };

  // Render the Line chart with provided data and options
  return <Line data={data3} width={300} options={options} />;
};

export default CustomLine;
