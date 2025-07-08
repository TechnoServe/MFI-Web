import React from 'react';
import {Bar} from 'react-chartjs-2';
import propTypes from 'prop-types';

/**
 * Renders a bar chart comparing validated SAT scores and self-assessment scores
 * across various assessment categories using react-chartjs-2.
 *
 * @param {Object} props - Component props.
 * @param {Array<number>} props.extractedSATScores - Array of validated SAT scores for the chart.
 * @returns {JSX.Element} A bar chart comparing two datasets.
 */
const AssessmentChart = ({extractedSATScores}) => {
  // Define the chart data with two datasets: validated scores and self-assessment scores
  const data3 = {
    labels: [
      'Personnel',
      'Production',
      'Procurement and Suppliers',
      'Public Engagement',
      'Governance',
    ],
    datasets: [
      {
        label: 'validated score',
        data: [...extractedSATScores],
        backgroundColor: 'rgba(202, 211, 244, 1)',
        borderWidth: 1,
        barThickness: 37,
        minBarLength: 2,
        barPercentage: 5.0,
      },
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

  // Configure chart options including Y-axis formatting with percentage symbols
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

  // Render the Bar chart using configured data and options
  return <Bar data={data3} options={options} />;
};

export default AssessmentChart;

AssessmentChart.propTypes = {
  extractedSATScores: propTypes.any
};
