import React from 'react';
import {Bar} from 'react-chartjs-2';
import propTypes from 'prop-types';

/**
 * Renders a bar chart of product testing scores and overlays a line for the minimum compliance threshold.
 *
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.productTestData - Array of product testing data including results and compliance percentages.
 * @returns {JSX.Element} A rendered Bar chart comparing compliance scores with threshold.
 */
const AssessmentChart = ({productTestData}) => {
  // Arrays to store compliance percentages and micronutrient names
  let percentageCompliance = [];
  let microNutrients = [];

  // Extract compliance percentages and micronutrient names if data is available
  if (productTestData.length>0) {
    percentageCompliance = productTestData[0].results.map((response) => response.percentage_compliance);
    microNutrients = productTestData[0].results.map((response) => response.microNutrient.name);
  } else {
    // Fallback values when no data is present
    percentageCompliance = 0;
    microNutrients = 'N.A';
  }


  // Chart data configuration with two datasets:
  // - A red line for minimum compliance threshold (80%)
  // - A blue bar for product testing scores
  const data3 = {
    labels: microNutrients,
    datasets: [
      {
        label: 'Minimum Compliance Threshold',
        type: 'line',
        borderColor: 'rgba(256, 0, 0,  1)',
        backgroundColor: 'rgba(256, 0, 0,  1)',
        borderWidth: 3,
        fill: false,
        data: percentageCompliance.length === 1 ? [80]
          : percentageCompliance.length === 2 ? [80, 80]
            : percentageCompliance.length === 3 ? [80, 80, 80]
              : ''
      },
      {
        label: 'Product Testing Score',
        type: 'bar',
        data: percentageCompliance,
        backgroundColor: 'rgba(82, 108, 219, 1)',
        borderWidth: 1,
        barThickness: 37,
        minBarLength: 2,
        barPercentage: 5.0,
      },
    ],
  };

  // Chart options including Y-axis formatting with percentage symbol
  const options = {
    scales: {
      y: {
        max: 400,
        ticks: {
          // Include a percentage sign in the ticks
          callback: function (value) {
            return value + '%';
          },
        },
      },
    },
  };

  // Render the Bar chart with defined data and options
  return <Bar data={data3} options={options} />;
};

AssessmentChart.propTypes = {
  productTestData: propTypes.any
};

export default AssessmentChart;
