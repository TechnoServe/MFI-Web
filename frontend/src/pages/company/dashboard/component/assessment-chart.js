import React from 'react';
import {Bar} from 'react-chartjs-2';
import propTypes from 'prop-types';

/**
 * AssessmentChart renders a bar chart comparing validated and self-assessment scores
 * across five key assessment categories. Uses Chart.js for rendering.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<number>} props.extractedSATScores - Array of validated scores from backend
 * @returns {JSX.Element} A bar chart visualization of SAT performance
 */
const AssessmentChart = ({extractedSATScores}) => {
  // Define the data and datasets used in the bar chart
  const data3 = {
    labels: [
      'Personnel',
      'Production',
      'Procurement and Suppliers',
      'Public Engagement',
      'Governance',
    ],
    datasets: [
      // Dataset for validated scores (pulled from props)
      {
        label: 'validated score',
        data: [...extractedSATScores],
        backgroundColor: 'rgba(202, 211, 244, 1)',
        borderWidth: 1,
        barThickness: 37,
        minBarLength: 2,
        barPercentage: 5.0,
      },
      // Dataset for static self-assessment scores
      {
        label: 'self assessment score',
        data: [21, 17, 9, 11, 17],
        backgroundColor: 'rgba(82, 108, 219, 1)',
        borderWidth: 1,
        barThickness: 37,
        minBarLength: 2,
        barPercentage: 5.0,
      },
    ],
  };

  // Chart configuration options including y-axis formatting
  const options = {
    scales: {
      y: {
        max: 100,
        ticks: {
          // Include a percentage sign in the ticks
          callback: function (value) {
            return value + '%';
          },
        },
      },
    },
  };

  // Render the bar chart with the configured data and options
  return <Bar data={data3} options={options} />;
};

export default AssessmentChart;

AssessmentChart.propTypes = {
  extractedSATScores: propTypes.any
};
