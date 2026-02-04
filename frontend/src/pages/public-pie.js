/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import {Pie} from 'react-chartjs-2';
// import {Spinner} from '@chakra-ui/react';
// import {request} from 'common';
// import {set} from 'core-js/core/dict';

// import MFICOY from '../../../../Dummie/mfiScoreSheet';


/**
 * PublicPieChart displays a pie chart visualizing the industry breakdown
 * of flour, edible oil, and sugar product types among ranked companies.
 *
 * @component
 * @param {Object} props - React component props
 * @param {string[]} props.bg - Array of background colors for the chart
 * @returns {JSX.Element} A rendered pie chart or loading spinner
 */
const PublicPieChart = ({bg}) => {
  // State to control loading spinner visibility
  // const [spinning, setSpinning] = useState(false);
  // State to store the total count of Edible Oil products
  const [edibleOil] = useState(14);
  // State to store the total count of Flour products
  const [flour] = useState(14);
  // State to store the total count of Sugar products
  const [sugar] = useState(4);

  // Run data fetch when component mounts
  // useEffect(() => {
  //   getCompanies();
  // }, []);

  // Configuration for pie chart dataset and labels
  const data3 = {
    labels: ['Wheat Flour', 'Edible Oil', 'Sugar'],
    datasets: [
      {
        label: 'Industry Breakdown',
        data: [flour, edibleOil, sugar],
        backgroundColor: bg,
        hoverOffset: 4,
      },
    ],
  };

  // Chart display options (legend placement, responsiveness)
  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
    responsive: false,
  };

  // Render spinner while loading, otherwise display the pie chart
  return (
    <Pie data={data3} options={options} />
  );
};
export default PublicPieChart;
