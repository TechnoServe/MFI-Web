import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import PropTypes from 'prop-types';

/**
 * Renders a comparative bar chart of MFI component scores for a specific brand vs all industries.
 * It calculates and aggregates SAT, IEG, and PT scores using brand and company data.
 *
 * @param {Object} props - Component props.
 * @param {string} props.industry - Selected industry name.
 * @param {Array<number>} props.industryScores - MFI component scores for the selected brand.
 * @param {Array<Object>} props.filteredData - List of company objects filtered by industry and tier.
 * @param {number} props.MFIBrandTotalBrand - Overall MFI score for the selected brand.
 * @param {number} props.SABrandsTierOne - SAT score for Tier 1 brands.
 * @param {number} props.SABrandsTierThree - SAT score for Tier 3 brands.
 * @param {number} props.IEGBrands - IEG score for the selected brand.
 * @param {number} props.PTTesting - Product Testing score for the selected brand.
 * @returns {JSX.Element} A bar chart showing comparative MFI performance.
 */
const AssessmentCompany = ({industry, industryScores, filteredData, MFIBrandTotalBrand, SABrandsTierOne, SABrandsTierThree, IEGBrands, PTTesting}) => {
  console.log('industry', industry);
  const [allSelfAssessment, setAllSelfAssessment] = useState();
  const [allIndustryExpertGroup, setAllIndustryExpertGroup] = useState();
  const [allProductTesting, setAllProductTesting] = useState();
  const [allMfi, setAllMfi] = useState();

  const getAllCompanies = async () => {
    try {
      // Get the number of brands per company for weighting calculations
      const allBrandsLength = filteredData?.map((product) => product?.brands.length);
      // Filter Tier 1 and Tier 3 companies for SAT breakdown
      const tierOneBrands = filteredData.filter((x) => x.tier.includes('TIER_1'));

      // Count number of product types per brand for SAT weighting
      const culSelfAssessmentTierOne = tierOneBrands?.map((x) => x.brands.map((x) => x.productType.name).filter(Boolean).length);
      console.log('culSelfAssessmentTierOne', culSelfAssessmentTierOne);
      // Sum IVC scores per brand to use for weighted SAT computation
      const tierOneCul = tierOneBrands.map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));

      const tierOnePercentage = tierOneCul.map((x) => x / 100 * 60);
      // console.log('tierOnePercentage', tierOnePercentage);
      const totalTotalTierOne = tierOnePercentage.reduce(function (r, a) {
        return r + a;
      }, 0);
      // console.log('totalTotalTierOne', totalTotalTierOne);
      // Aggregate and combine weighted SAT scores across tiers
      const totalTierOne = tierOnePercentage.reduce((sum, x) => sum + x, 0);

      // Filter Tier 1 and Tier 3 companies for SAT breakdown
      const tierThreeBrands = filteredData.filter((x) => x.tier.includes('TIER_3'));

      // Count number of product types per brand for SAT weighting
      const culSelfAssessmentTierThree = tierThreeBrands?.map((x) => x.brands.map((x) => x.productType.name).filter(Boolean).length);

      // Sum IVC scores per brand to use for weighted SAT computation
      const tierThreeCul = tierThreeBrands.map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));


      // const totalTierThree = culSelfAssessmentTierThree.reduce(function (r, a, i) {
      //   return r + a * tierThreeCul[i];
      // }, 0);
      // Aggregate and combine weighted SAT scores across tiers
      const totalTierThree = tierThreeCul.reduce((sum, x) => sum + x, 0);
      const addTierOneAndTierThree = totalTierThree + totalTierOne;

      const totalTotalTierThree = culSelfAssessmentTierThree.reduce(function (r, a, i) {
        return r + a * tierThreeCul[i];
      }, 0);
      const totalAddTierOneAndTierThree = totalTotalTierThree + totalTotalTierOne;

      const totalTierOneAndTierThreeTotal = totalAddTierOneAndTierThree / allBrandsLength.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      // console.log('totalTierOneAndTierThreeTotal', totalTierOneAndTierThreeTotal);

      const tierOneAndTierThreeTotal = addTierOneAndTierThree / filteredData.length;
      // Compute and store the average SAT score
      setAllSelfAssessment((tierOneAndTierThreeTotal).toFixed());

      // Calculate weighted IEG scores across brands and companies
      const industryExpertGroup = filteredData?.map((x) => x.iegScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));

      const culIndustryExpertGroup = filteredData?.map((x) => x.brands.map((x) => x.productType.name).filter(Boolean).length);


      const grandTotalIndustryExpertGroup = culIndustryExpertGroup.reduce(function (r, a, i) {
        return r + a * industryExpertGroup[i];
      }, 0) / allBrandsLength?.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      // console.log('grandTotalIndustryExpertGroup', grandTotalIndustryExpertGroup);

      // Compute and store average IEG score
      const totalIndustryExpertGroup = industryExpertGroup.reduce((sum, x) => sum + x, 0) / filteredData.length;

      setAllIndustryExpertGroup(totalIndustryExpertGroup.toFixed());

      // Extract and transform product testing data into weighted scores using thresholds
      const latestProductTesting = filteredData.map((x) => x.brands.map((x) => x.productTests.sort((a, b) => new Date(b.sample_production_date).getTime() - new Date(a.sample_production_date).getTime())[0]));
      // const allProducts = latestProductTesting.map((x) => x.map((x) => x.fortification.score).reduce(function (accumulator, currentValue) {
      //   return accumulator + currentValue;
      // }, 0));
      const allProductsAdjustedScores = latestProductTesting.map((x) => x.map((x) => x.results.map(({percentage_compliance: compliance, ...others}) => ({...others, mfiScore: compliance >= 80 ? 20 : compliance >= 51 ? 10 : compliance >= 31 ? 5 : 0}))));
      const productTestingBrandScores = allProductsAdjustedScores.map((x) => x.map((x) => x.map((x) => x).reduce((accumulator, {mfiScore, microNutrient, product_type: type}) => accumulator + (type==='XjGrnod6DDbJFVxtZDkD'?(microNutrient.name == 'Vitamin A'?(mfiScore*0.6):(mfiScore*0.2)):mfiScore), 0)));

      // const productTestingTotal = allProducts.reduce((sum, x) => sum + x, 0) / allBrandsLength?.reduce(function (accumulator, currentValue) {
      //   return accumulator + currentValue;
      // }, 0);
      // Compute and store average PT score
      const productTestingTotal = productTestingBrandScores.reduce((sum, x) => sum + x.reduce((sum, x) => sum + x, 0), 0) / allBrandsLength?.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);

      setAllProductTesting(productTestingTotal.toFixed());

      // Combine SAT, IEG, and PT scores into final MFI score
      const satValue = totalTierOneAndTierThreeTotal;
      const ptWeightedScore = productTestingTotal;
      // console.log('ptWeightedScore', ptWeightedScore);
      const iegWeightedScore = (grandTotalIndustryExpertGroup.toFixed() / 100) * 20;
      // console.log('iegWeightedScore', iegWeightedScore);
      const satWeightedScore = (satValue / 100) * 60;
      // console.log('satWeightedScore', satWeightedScore);
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

  // Bar chart dataset comparing brand scores vs all-industry averages
  const data3 = {
    labels: ['Overall MFI Score', 'Self Assessment', 'Industry Expert Group', 'Product Quality Testing'],
    datasets: [
      {
        label: `Brand MFI Scores`,
        data: industryScores.length === 0 ? [MFIBrandTotalBrand, parseInt(SABrandsTierThree) === 0 ? parseInt(SABrandsTierOne) : parseInt(SABrandsTierOne) === 0 ? parseInt(SABrandsTierThree) : '', IEGBrands, PTTesting] : industryScores,
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

  // Chart display options: Y-axis formatting and legend positioning
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
  // Render the bar chart with computed data
  return (
    <Bar data={data3} options={options} />
  );
};

AssessmentCompany.propTypes = {
  industry: PropTypes.string,
  industryScores: PropTypes.array,
  filteredData: PropTypes.any,
  MFIBrandTotalBrand: PropTypes.any,
  SABrandsTierOne: PropTypes.any,
  SABrandsTierThree: PropTypes.any,
  IEGBrands: PropTypes.any,
  PTTesting: PropTypes.any
};

export default AssessmentCompany;
