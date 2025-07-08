/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import {Pie} from 'react-chartjs-2';
import {Spinner} from '@chakra-ui/react';
import PropTypes from 'prop-types';

/**
 * PieChart component renders a pie chart showing the industry breakdown of product types:
 * Wheat Flour, Edible Oil, and Sugar. It processes the incoming response data to extract counts.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.response - Response data containing companies and product type details
 * @param {Array<string>} props.bg - Array of background color values for the chart
 * @returns {JSX.Element} A pie chart visualization or loading spinner
 */
const PieChart = ({bg, response}) => {
  // Loading state for the chart
  const [spinning, setSpinning] = useState(false);
  // States to hold the count of each product type: Edible Oil, Flour, and Sugar
  const [edibleOil, setEdibleOil] = useState();
  const [flour, setFlour] = useState();
  const [sugar, setSugar] = useState();

  // Extracts and aggregates the number of product types per category from response data
  const getCompanies = async () => {
    try {
      setSpinning(true);

      // Remove a specific ID from the response data
      const filteredResponse = response?.data?.filter((x) => x.id !== 'akpQPiE0sFH2iwciggHd');

      // Count product types matching each category
      const dataEdibleOil = filteredResponse?.map((product) => product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Edible Oil').map((x) => x?.name).length);

      const dataFlour = filteredResponse?.map((product) => product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Flour').map((x) => x?.name).length);

      const dataSugar = filteredResponse?.map((product) => product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Sugar').map((x) => x?.name).length);

      // Sum up the counts for each category
      setEdibleOil(dataEdibleOil?.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      setFlour(dataFlour?.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      setSugar(dataSugar?.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      setSpinning(false);
    } catch (error) {
      // return toast({
      //   status: 'error',
      //   title: 'Error',
      //   position: 'top-right',
      //   description: 'Something went wrong',
      //   duration: 6000,
      //   isClosable: true,
      // });
    }
  };

  // Re-fetch company data when any of the product type counts change
  useEffect(() => {
    getCompanies();
  }, [sugar, flour, edibleOil]);

  // Chart configuration: labels and dataset values
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

  // Chart display options
  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
    responsive: false,
  };

  // Render spinner if loading, else render the pie chart
  return (
    <>

      {(spinning && <Spinner />) || <Pie data={data3} options={options} />}
    </>

  );
};
PieChart.propTypes = {
  response: PropTypes.any,
};
export default PieChart;
