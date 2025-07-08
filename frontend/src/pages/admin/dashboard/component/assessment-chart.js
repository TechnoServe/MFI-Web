import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import PropTypes from 'prop-types';

/**
 * Renders a comparative bar chart of MFI scores for a specific industry and all industries.
 * Calculates and aggregates Self-Assessment, Industry Expert Group, and Product Testing scores.
 *
 * @param {Object} props - Component props.
 * @param {string} props.industry - The name of the selected industry.
 * @param {Array<number>} props.industryScores - Array of MFI scores for the selected industry.
 * @param {Array<Object>} props.filteredData - Array of company data filtered by industry and tier.
 * @param {number} props.mfiFlourData - Overall MFI score for the selected industry.
 * @param {number} props.SAFlour - Self-Assessment score for the selected industry.
 * @param {number} props.IEGFlour - Industry Expert Group score for the selected industry.
 * @param {number} props.PTFlour - Product Testing score for the selected industry.
 * @returns {JSX.Element} A Bar chart showing comparative MFI performance.
 */
const AssessmentChart = ({industry, industryScores, filteredData, mfiFlourData, SAFlour, IEGFlour, PTFlour}) => {
  const [allSelfAssessment, setAllSelfAssessment] = useState();
  const [allIndustryExpertGroup, setAllIndustryExpertGroup] = useState();
  const [allProductTesting, setAllProductTesting] = useState();
  const [allMfi, setAllMfi] = useState();

  const getAllCompanies = async () => {
    try {
      const allBrandsLength = filteredData?.map((product) => product?.brands.length);
      // Filter Tier 1 companies and compute SAT-related values
      const tierOneBrands = filteredData.filter((x) => x.tier.includes('TIER_1'));

      // Debug: log count of Tier 1 brand product types per company
      const culSelfAssessmentTierOne = tierOneBrands?.map((x) => x.brands.map((x) => x.productType.name).filter(Boolean).length);
      console.log('culSelfAssessmentTierOne', culSelfAssessmentTierOne);
      const tierOneCul = tierOneBrands.map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));

      const tierOnePercentage = tierOneCul.map((x) => x / 100 * 60);
      // console.log('tierOnePercentage', tierOnePercentage);
      const totalTotalTierOne = tierOnePercentage.reduce(function (r, a) {
        return r + a;
      }, 0);
      // console.log('totalTotalTierOne', totalTotalTierOne);
      const totalTierOne = tierOnePercentage.reduce((sum, x) => sum + x, 0);

      // Filter Tier 3 companies and compute SAT-related values
      const tierThreeBrands = filteredData.filter((x) => x.tier.includes('TIER_3'));

      const culSelfAssessmentTierThree = tierThreeBrands?.map((x) => x.brands.map((x) => x.productType.name).filter(Boolean).length);

      const tierThreeCul = tierThreeBrands.map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));

      // const totalTierThree = culSelfAssessmentTierThree.reduce(function (r, a, i) {
      //   return r + a * tierThreeCul[i];
      // }, 0);
      const totalTierThree = tierThreeCul.reduce((sum, x) => sum + x, 0);
      const addTierOneAndTierThree = totalTierThree + totalTierOne;

      const totalTotalTierThree = culSelfAssessmentTierThree.reduce(function (r, a, i) {
        return r + a * tierThreeCul[i];
      }, 0);
      const totalAddTierOneAndTierThree = totalTotalTierThree + totalTotalTierOne;

      const totalTierOneAndTierThreeTotal = totalAddTierOneAndTierThree / allBrandsLength.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      console.log('totalTierOneAndTierThreeTotal', totalTierOneAndTierThreeTotal);

      const tierOneAndTierThreeTotal = addTierOneAndTierThree / filteredData.length;
      setAllSelfAssessment((tierOneAndTierThreeTotal).toFixed());

      // Compute Industry Expert Group average scores
      const industryExpertGroup = filteredData?.map((x) => x.iegScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));

      const culIndustryExpertGroup = filteredData?.map((x) => x.brands.map((x) => x.productType.name).filter(Boolean).length);

      const grandTotalIndustryExpertGroup = culIndustryExpertGroup.reduce(function (r, a, i) {
        return r + a * industryExpertGroup[i];
      }, 0) / allBrandsLength?.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      console.log('grandTotalIndustryExpertGroup', grandTotalIndustryExpertGroup);
      const totalIndustryExpertGroup = industryExpertGroup.reduce((sum, x) => sum + x, 0) / filteredData.length;

      setAllIndustryExpertGroup(totalIndustryExpertGroup.toFixed());

      // Extract the most recent product test for each brand
      const latestProductTesting = filteredData?.map((x) => x?.brands.map((x) => x?.productTests?.sort((a, b) => new Date(b?.sample_production_date).getTime() - new Date(a?.sample_production_date).getTime())[0]));

      // console.log('latestProductTestingEdibleOil', filteredData?.map((x) => x?.brands.map((x) => x?.productTests.map((x) => x[0]?.brand_id))));

      // const allProducts = latestProductTestingEdibleOil?.map((x) => x?.map((x) => x?.fortification.score).reduce(function (accumulator, currentValue) {
      //   return accumulator + currentValue;
      // }, 0));
      // Convert product test compliance scores into weighted MFI scores
      const allProductsAdjustedScores = latestProductTesting.map((x) => x.map((x) => x.results.map(({percentage_compliance: compliance, ...others}) => ({...others, mfiScore: compliance >= 80 ? 20 : compliance >= 51 ? 10 : compliance >= 31 ? 5 : 0}))));
      const productTestingBrandScores = allProductsAdjustedScores.map((x) => x.map((x) => x.map((x) => x).reduce((accumulator, {mfiScore, microNutrient, product_type: type}) => accumulator + (type==='XjGrnod6DDbJFVxtZDkD'?(microNutrient.name == 'Vitamin A'?(mfiScore*0.6):(mfiScore*0.2)):mfiScore), 0)));


      // const productTestingTotal = allProducts.reduce((sum, x) => sum + x, 0) / allBrandsLength?.reduce(function (accumulator, currentValue) {
      //   return accumulator + currentValue;
      // }, 0);
      const productTestingTotal = productTestingBrandScores.reduce((sum, x) => sum + x.reduce((sum, x) => sum + x, 0), 0) / allBrandsLength?.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);

      setAllProductTesting(productTestingTotal.toFixed());

      // Final MFI score calculation based on weighted component scores
      const satValue = totalTierOneAndTierThreeTotal;
      const ptWeightedScore = productTestingTotal;
      const iegWeightedScore = (grandTotalIndustryExpertGroup.toFixed() / 100) * 20;
      const satWeightedScore = (satValue / 100) * 60;
      const MFITotal = ptWeightedScore + iegWeightedScore + satWeightedScore;

      setAllMfi(MFITotal.toFixed());
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

  // Save MFI scores
  localStorage.setItem('mfi', JSON.stringify(allMfi));
  useEffect(() => {
    getAllCompanies();
  });

  // Bar chart datasets for industry vs all industries
  const data3 = {
    labels: ['Overall MFI Score', 'Self Assessment', 'Industry Expert Group', 'Product Quality Testing'],
    datasets: [
      {
        label: `${industry} Industry Average MFI Scores`,
        data: industryScores.length === 0 ? [mfiFlourData, SAFlour, IEGFlour, PTFlour] : industryScores,
        backgroundColor: 'rgba(82, 108, 219, 1)',
        borderWidth: 1,
        barThickness: 37,
        minBarLength: 2,
        barPercentage: 5.0,
      },
      {
        label: 'All Industries Average MFI Scores',
        data: [allMfi, allSelfAssessment, allIndustryExpertGroup, allProductTesting],
        backgroundColor: 'rgba(202, 211, 244, 1)',
        borderWidth: 1,
        barThickness: 37,
        minBarLength: 2,
        barPercentage: 5.0,
      },
    ],

  };

  // Chart display configuration including Y-axis and legend
  const options = {
    maintainAspectRatio: true,
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
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };
  return (
    <Bar data={data3} options={options} />
  );
};

AssessmentChart.propTypes = {
  industry: PropTypes.string,
  industryScores: PropTypes.array,
  filteredData: PropTypes.any,
  mfiFlourData: PropTypes.any,
  SAFlour: PropTypes.any,
  IEGFlour: PropTypes.any,
  PTFlour: PropTypes.any
};

export default AssessmentChart;
