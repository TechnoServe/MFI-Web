/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import {Pie} from 'react-chartjs-2';
import {Spinner} from '@chakra-ui/react';
import {request} from 'common';

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
  const [spinning, setSpinning] = useState(false);
  // State to store the total count of Edible Oil products
  const [edibleOil, setEdibleOil] = useState();
  // State to store the total count of Flour products
  const [flour, setFlour] = useState();
  // State to store the total count of Sugar products
  const [sugar, setSugar] = useState();

  /**
   * Fetches company ranking list and aggregates counts of Edible Oil,
   * Flour, and Sugar product types from brand data.
   *
   * @returns {Promise<void>}
   */
  const getCompanies = async () => {
    try {
      setSpinning(true);
      const {
        data: {data: res},
      } = await request().get(`/ranking-list?page-size=50`);

      // Remove a specific company entry by ID from the result set
      const filteredResponse = res.filter((x) => x.id !== 'akpQPiE0sFH2iwciggHd');

      // Extract and count product types that match the given name
      const dataEdibleOil = filteredResponse?.map((product) => product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Edible Oil').map((x) => x?.name).length);
      // Extract and count product types that match the given name
      const dataFlour = filteredResponse?.map((product) => product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Flour').map((x) => x?.name).length);
      // Extract and count product types that match the given name
      const dataSugar = filteredResponse?.map((product) => product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Sugar').map((x) => x?.name).length);

      // Calculate the total count by summing all matching entries
      setEdibleOil(dataEdibleOil.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      // Calculate the total count by summing all matching entries
      setFlour(dataFlour.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      // Calculate the total count by summing all matching entries
      setSugar(dataSugar.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      setSpinning(false);
    } catch (error) {
      console.log({error});
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

  // Run data fetch when component mounts
  useEffect(() => {
    getCompanies();
  }, []);

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
    <>
      {(spinning && <Spinner />) || <Pie data={data3} options={options} />}
    </>
  );
};
export default PublicPieChart;
