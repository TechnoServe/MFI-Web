import React from 'react';
import {Bar} from 'react-chartjs-2';
import propTypes from 'prop-types';

/**
 * AssessmentChart renders a bar chart showing product testing scores for micronutrients
 * alongside a minimum compliance threshold line.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.productTestData - Array of product test result objects with micronutrient scores
 * @returns {JSX.Element} A rendered bar chart comparing compliance scores to a threshold
 */
const AssessmentChart = ({productTestData}) => {

  // Array to store compliance percentages for each micronutrient
  let percentageCompliance = [];
  // Array to store micronutrient names
  let microNutrients = [];

  // Extract compliance and nutrient data if available
  if (productTestData.length > 0) {
    percentageCompliance = productTestData[0].results.map((response) => response.percentage_compliance);
    microNutrients = productTestData[0].results.map((response) => response.microNutrient.name);
  } else {
    // If no data, fallback to default values
    percentageCompliance = 0;
    microNutrients = 'N.A';
  }
  // Chart.js dataset and label configuration
  const data3 = {
    labels: microNutrients,
    datasets: [
      // Line dataset for compliance threshold
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
      // Bar dataset for actual product scores
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

  // Chart options including y-axis scaling and label formatting
  const options = {
    scales: {
      y: {
        max: 400,
        ticks: {
          // Append '%' symbol to y-axis values
          callback: function (value) {
            return value + '%';
          },
        },
      },
    },
  };

  // Render the bar chart using Chart.js with the defined data and options
  return <Bar data={data3} options={options} />;
};

AssessmentChart.propTypes = {
  productTestData: propTypes.any
};

export default AssessmentChart;
