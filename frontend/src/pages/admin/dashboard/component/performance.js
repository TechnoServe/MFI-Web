import {Text, Flex, Spinner} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import AssessmentChart from './assessment-chart';
import {request} from 'common';

/**
 * Performance component retrieves company performance metrics (SAT, IEG, PT)
 * across three product categories: Sugar, Flour, and Edible Oil.
 * It computes weighted MFI scores and renders a chart for selected industry.
 *
 * @component
 * @param {Object} props - React component props
 * @param {string} props.name - Title to display above the chart
 * @returns {JSX.Element} A performance dashboard with industry selector and assessment chart
 */
const Performance = ({name}) => {
  // State variables for SAT, IEG, PT, and MFI scores for each product type
  // Chart States for Sugar
  const [SASugar, setSASugar] = useState(0);
  const [IEGSugar, setIEGSugar] = useState(0);
  const [PTSugar, setPTSugar] = useState(0);
  const [MFISugar, setMFISugar] = useState(0);

  // Chart state for Flour
  const [SAFlour, setSAFlour] = useState(0);
  const [IEGFlour, setIEGFlour] = useState(0);
  const [PTFlour, setPTFlour] = useState(0);
  const [mfiFlourData, setMFIFlourData] = useState(0);

  // Chart state for Edible Oil
  const [SAEdibleOils, setSAEdibleOils] = useState(0);
  const [IEGEdibleOils, setIEGEdibleOils] = useState(0);
  const [PTEdibleOils, setPTEdibleOils] = useState(0);
  const [MFIEdibleOils, setMFIEdibleOils] = useState(0);
  const [industry, setIndustry] = useState('Flour');
  // 71, 91, 66, 18
  const [industryScores, setIndustryScores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [edibleOil, setEdibleOil] = useState();
  const [flour, setFlour] = useState();
  const [sugar, setSugar] = useState();
  const [filteredData, setFilteredData] = useState();
  const [cycleYear, setCycleYear] = useState();
  // const toast = useToast();

  useEffect(() => {
    // Fetch the currently active assessment cycle
    getActiveCycle();
  }, [mfiFlourData, SAFlour, IEGFlour, PTFlour]);

  /**
   * Fetches the active assessment cycle from backend and sets the year.
   * Then triggers company performance data loading.
   *
   * @returns {Promise<void>}
   */
  const getActiveCycle = async () => {
    try {
      const {data: res} = await request(true).get(
        `/company/active-cycle`
      );
      const fireBaseTime = new Date(
        res.end_date._seconds * 1000 + res.end_date._nanoseconds / 1000000,
      );
      setCycleYear(fireBaseTime.getFullYear());
      console.log('cycleYear', cycleYear);
      getCompanies();
    } catch (error) {
      console.log('error', error);
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

  /**
   * Fetches company performance data, calculates SAT, IEG, and PT scores
   * for Sugar, Flour, and Edible Oil, and sets loading state.
   *
   * @returns {Promise<void>}
   */
  const getCompanies = async () => {
    setLoading(true);
    console.log(loading);
    try {
      const {
        data: {data: res},
      } = await request().get(`/ranking-list?page-size=30`);
      // Filter valid companies with all score types
      const filteredResponse = res.filter((x) => x.id !== 'akpQPiE0sFH2iwciggHd');

      const reFilteredResponse = filteredResponse?.filter((x) => x.iegScores.length && x.ivcScores.length && x.satScores.length);
      setFilteredData(reFilteredResponse);

      // Count brands by product type for participation stats
      const dataEdibleOil = reFilteredResponse?.map((product) => product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Edible Oil').map((x) => x?.name).length);
      const dataFlour = reFilteredResponse?.map((product) => product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Flour').map((x) => x?.name).length);
      const dataSugar = reFilteredResponse?.map((product) => product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Sugar').map((x) => x?.name).length);

      setEdibleOil(dataEdibleOil.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      setFlour(dataFlour.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      setSugar(dataSugar.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));

      // Compute SAT scores for Sugar across Tier 1 and Tier 3
      // Sugar SAT Charts
      const selfAssessmentSugar = reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.name.includes('Sugar')));
      // Tier One Breakdown
      const tierOneSASugar = selfAssessmentSugar.filter((x) => x.tier.includes('TIER_1'));
      const tierOneSASugarBrands = tierOneSASugar.map((x) => x.brands.map((x) => x.productType.name === 'Edible Oil').filter(Boolean).length);
      console.log('tierOneSASugarBrands', tierOneSASugarBrands);
      const tierOneSatSugar = tierOneSASugar.filter((x) => x.tier.includes('TIER_1')).map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }));
      const percentageTierOneSatSugar = tierOneSatSugar.map((x) => x / 100 * 60);
      const totalTierOneSATSugar = percentageTierOneSatSugar.reduce((sum, x) => sum + x, 0);
      // Tier Three Breakdown
      const tierThreeSASugar = selfAssessmentSugar.filter((x) => x.tier.includes('TIER_3'));
      console.log('tierThreeSASugar', tierThreeSASugar);
      const tierThreeSatSugar = tierThreeSASugar.filter((x) => x.tier.includes('TIER_3')).map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }));
      console.log('tierThreeSatSugar', tierThreeSatSugar);
      const totalTierThreeSATSugar = tierThreeSatSugar.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / tierThreeSatSugar.length;
      console.log('totalTierThreeSATSugar', totalTierThreeSATSugar);
      if (totalTierOneSATSugar || 0 === 0) {
        const tierOneAndTierThreeSugarTotal = totalTierThreeSATSugar;
        setSASugar(tierOneAndTierThreeSugarTotal.toFixed());
      }
      if (totalTierOneSATSugar > 0) {
        const tierOneAndTierThreeSugarTotal = totalTierThreeSATSugar + totalTierOneSATSugar || 0;
        setSASugar((tierOneAndTierThreeSugarTotal / 2).toFixed());
      }

      // Compute IEG scores for Sugar
      // Sugar IEG Charts
      const industryExpertSugar = reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.name.includes('Sugar')));
      const culIndustryExpertSugar = industryExpertSugar?.map((x) => x.iegScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      const totalIEGsugar = culIndustryExpertSugar.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / culIndustryExpertSugar.length;
      setIEGSugar(totalIEGsugar.toFixed());

      // Compute PT scores for Sugar using latest test results
      // Sugar PT Charts
      const filterSugar = reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.value === 'Sugar'));
      const culProductTestingSugar = filterSugar.map((x) => x.brands.filter((x) => x.productType.name === 'Sugar'));
      const latestProductTestingSugar = culProductTestingSugar.map(((x) => x.map((x) => x.productTests.sort((a, b) => new Date(b.sample_production_date).getTime() - new Date(a.sample_production_date).getTime())[0])));
      console.log('latestProductTestingSugar', latestProductTestingSugar);
      const fortifyProductTestingSugar = latestProductTestingSugar.map((x) => x.map((x) => x.fortification));
      console.log('fortifyProductTestingSugar', fortifyProductTestingSugar);
      const addProductTestingSugar = fortifyProductTestingSugar.map((x) => x.map((x) => x.score).reduce((sum, x) => sum + x, 0));
      console.log('addProductTestingSugar', addProductTestingSugar);
      const totalProductTestingSugar = addProductTestingSugar.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / dataSugar.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      setPTSugar(totalProductTestingSugar);

      // Repeat SAT, IEG, PT calculations for Flour and Edible Oil
      // Flour SAT Charts
      const selfAssessmentFlour = reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.name.includes('Flour')));
      // Tier One Breakdown
      const tierOneSAFlour = selfAssessmentFlour.filter((x) => x.tier.includes('TIER_1'));
      const tierOneSAFlourBrands = tierOneSAFlour.map((x) => x.brands.map((x) => x.productType.name === 'Edible Oil').filter(Boolean).length);
      const tierOneSatFlour = tierOneSAFlour.filter((x) => x.tier.includes('TIER_1')).map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }));
      const percentageTierOneSatFlour = tierOneSatFlour.map((x) => x / 100 * 60);
      const totalTierOneSATFlour = tierOneSAFlourBrands.reduce(function (r, a, i) {
        return r + a * percentageTierOneSatFlour[i];
      }, 0) / tierOneSAFlourBrands.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      // Tier Three Breakdown
      const tierThreeSAFlour = selfAssessmentFlour.filter((x) => x.tier.includes('TIER_3'));
      const tierThreeSatFlour = tierThreeSAFlour.filter((x) => x.tier.includes('TIER_3')).map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }));
      console.log('tierThreeSatFlour', tierThreeSatFlour);
      const totalTierThreeSATFlour = tierThreeSatFlour.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / tierThreeSatFlour.length;
      console.log('totalTierThreeSATFlour', totalTierThreeSATFlour);
      if (totalTierOneSATFlour || 0 === 0) {
        setSAFlour((totalTierThreeSATFlour).toFixed());
      }
      if (totalTierOneSATFlour > 0) {
        const tierOneAndTierThreeFlourTotal = totalTierThreeSATFlour + totalTierOneSATFlour || 0;
        setSAFlour((tierOneAndTierThreeFlourTotal / 2).toFixed());
      }
      // Flour  IEG Charts
      const industryExpertFlour = reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.name.includes('Flour')));
      const culIndustryExpertFlour = industryExpertFlour?.map((x) => x.iegScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      const totalIEGFlour = culIndustryExpertFlour.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / culIndustryExpertFlour.length;
      setIEGFlour(totalIEGFlour.toFixed());
      // Flour PT Charts
      const filterFlour = reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.value === 'Flour'));
      const culProductTestingFlour = filterFlour.map((x) => x.brands.filter((x) => x.productType.name === 'Flour'));
      const latestProductTestingFlour = culProductTestingFlour.map(((x) => x.map((x) => x.productTests.sort((a, b) => new Date(b.sample_production_date).getTime() - new Date(a.sample_production_date).getTime())[0])));
      console.log('latestProductTestingFlour', latestProductTestingFlour);
      const currentYearCycleLatestProductTestingFlour = latestProductTestingFlour.map((x) => x.map((x) => x).filter((x) => x.results.filter((x) => new Date(x.created_at).getFullYear() === cycleYear).length > 0));
      console.log('currentYearCycleLatestProductTestingFlour', currentYearCycleLatestProductTestingFlour);
      const allProductsAdjustedScoresFlour = currentYearCycleLatestProductTestingFlour.map((x) => x.map((x) => x.results.map(({percentage_compliance: compliance, ...others}) => ({...others, mfiScore: compliance >= 80 ? 20 : compliance >= 51 ? 10 : compliance >= 31 ? 5 : 0}))));
      const productTestingBrandScoresFlour = allProductsAdjustedScoresFlour.map((x) => x.map((x) => x.map((x) => x).reduce((accumulator, {mfiScore, microNutrient, product_type: type}) => accumulator + (type==='XjGrnod6DDbJFVxtZDkD'?(microNutrient.name == 'Vitamin A'?(mfiScore*0.6):(mfiScore*0.2)):mfiScore), 0)));
      console.log('productTestingBrandScoresFlour', productTestingBrandScoresFlour);
      const addProductTestingFlour = productTestingBrandScoresFlour.map((x) => x.map((x) => x).reduce((sum, x) => sum + x, 0));
      const totalProductTestingFlour = addProductTestingFlour.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / dataFlour.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      setPTFlour(totalProductTestingFlour);
      // Edible Oil SAT Charts
      const selfAssessmentEdibleOil = reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.name.includes('Edible Oil')));
      // Tier One Breakdown
      const tierOneSAEdibleOil = selfAssessmentEdibleOil.filter((x) => x.tier.includes('TIER_1'));
      const tierOneSatEdibleOil = tierOneSAEdibleOil.filter((x) => x.tier.includes('TIER_1')).map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }));
      console.log('tierOneSatEdibleOil', tierOneSatEdibleOil);
      const percentageTierOneSatEdibleOil = tierOneSatEdibleOil.map((x) => x / 100 * 60);
      const totalTotalTierOneSATEdibleOil = percentageTierOneSatEdibleOil.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / percentageTierOneSatEdibleOil.length;
      console.log('totalTotalTierOneSATEdibleOil', totalTotalTierOneSATEdibleOil);
      const totalTierOneSATEdibleOil = percentageTierOneSatEdibleOil.reduce((sum, x) => sum + x, 0);
      // Tier Three Breakdown
      const tierThreeSAEdibleOil = selfAssessmentEdibleOil.filter((x) => x.tier.includes('TIER_3'));
      const tierThreeSAEdibleOilBrands = tierThreeSAEdibleOil.map((x) => x.brands.map((x) => x.productType.name === 'Edible Oil').filter(Boolean).length);
      const tierThreeSatEdibleOil = tierThreeSAEdibleOil.filter((x) => x.tier.includes('TIER_3')).map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }));
      console.log('tierThreeSatEdibleOil', tierThreeSatEdibleOil);
      const totalTierThreeSATEdibleOil = tierThreeSatEdibleOil.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      console.log('totalTierThreeSATEdibleOil', totalTierThreeSATEdibleOil);
      if (totalTierOneSATEdibleOil || 0 === 0) {
        setSAEdibleOils(totalTierThreeSATEdibleOil.toFixed());
      }
      if (totalTierOneSATEdibleOil > 0) {
        const tierOneAndTierThreeEdibleOilTotal = totalTierThreeSATEdibleOil + totalTierOneSATEdibleOil;
        setSAEdibleOils((tierOneAndTierThreeEdibleOilTotal / (tierThreeSAEdibleOilBrands.length+tierOneSAEdibleOil.length)).toFixed());
      }
      // Edible Oil  IEG Charts
      const industryExpertEdibleOil = reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.name.includes('Edible Oil')));
      const culIndustryExpertEdibleOil = industryExpertEdibleOil?.map((x) => x.iegScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0));
      const totalIEGEdibleOil = culIndustryExpertEdibleOil.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / culIndustryExpertEdibleOil.length;
      setIEGEdibleOils(totalIEGEdibleOil.toFixed());
      // Edible Oil PT Charts
      const filterEdibleOil = reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.value === 'Edible Oil'));
      const culProductTestingEdibleOil = filterEdibleOil.map((x) => x.brands.filter((x) => x.productType.name === 'Edible Oil'));
      const latestProductTestingEdibleOil = culProductTestingEdibleOil.map(((x) => x.map((x) => x.productTests.sort((a, b) => new Date(b.sample_production_date).getTime() - new Date(a.sample_production_date).getTime())[0])));
      const fortifyProductTestingEdibleOil = latestProductTestingEdibleOil.map((x) => x.map((x) => x.fortification));
      const addProductTestingEdibleOil = fortifyProductTestingEdibleOil.map((x) => x.map((x) => x.score).reduce((sum, x) => sum + x, 0));
      const totalProductTestingEdibleOil = addProductTestingEdibleOil.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / dataEdibleOil.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      setPTEdibleOils(totalProductTestingEdibleOil);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  // Compute weighted MFI scores using SAT (60%) and IEG (20%) weights plus PT
  useEffect(() => {
    // Sugar MFI Charts
    const satValueSugar = SASugar;
    // const ptWeightedScoreSugar = (PTSugar / 100) * 20;
    const iegWeightedScoreSugar = (IEGSugar / 100) * 20;
    const satWeightedScoreSugar = (satValueSugar / 100) * 60;
    const sugarMFITotalSugar = PTSugar + iegWeightedScoreSugar + satWeightedScoreSugar;
    setMFISugar(sugarMFITotalSugar.toFixed());

    // Flour MFI Charts
    const satValueFlour = SAFlour;
    // const ptWeightedScoreFlour = PTFlour;
    const iegWeightedScoreFlour = (IEGFlour / 100) * 20;
    const satWeightedScoreFlour = (satValueFlour / 100) * 60;
    const flourMFITotal = PTFlour + iegWeightedScoreFlour + satWeightedScoreFlour;
    setMFIFlourData(flourMFITotal.toFixed());

    // Edible Oil MFI Charts
    const satValueEdibleOil = SAEdibleOils;
    // const ptWeightedScoreEdibleOil = (PTEdibleOils / 100) * 20;
    const iegWeightedScoreEdibleOil = (IEGEdibleOils / 100) * 20;
    const satWeightedScoreEdibleOil = (satValueEdibleOil / 100) * 60;
    const edibleOilMFITotal = PTEdibleOils + iegWeightedScoreEdibleOil + satWeightedScoreEdibleOil;
    setMFIEdibleOils(edibleOilMFITotal.toFixed());
  });

  /**
   * Updates the selected industry and sets the corresponding chart data.
   *
   * @param {Event} e - Change event from dropdown
   */
  const changeScores = (e) => {
    setIndustry(e.target.value);
    switch (e.target.value) {
      case 'Flour':
        setIndustryScores([mfiFlourData, SAFlour, IEGFlour, PTFlour]);
        break;
      case 'Edible Oil':
        setIndustryScores([MFIEdibleOils, SAEdibleOils, IEGEdibleOils, PTEdibleOils]);
        break;
      case 'Sugar':
        setIndustryScores([MFISugar, SASugar, IEGSugar, PTSugar]);
        break;
      default:
        break;
    }
  };

  // Render dropdown and performance chart or loading spinner
  return (
    <div className="margin-top-5 background-color-white radius-large padding-5 border-1px">
      <div className="">
        <div>
          <Text className="margin-bottom-5 weight-medium" fontSize="15px" fontWeight="700">
            {name}
          </Text>
        </div>
        <Flex>
          <form
            id="email-form"
            name="email-form"
            data-name="Email Form"
            className="flex-row-middle"
            style={{width: 350, padding: 10}}
          >
            <select
              id="field-2"
              name="field-2"
              value={industry}
              onChange={changeScores}
              data-name="Field 2"
              className="border-1px rounded-large background-color-white w-select"
            >              <option value="Flour">Wheat Flour ({flour === undefined ? 'loading...' : flour})</option>
              <option value="Edible Oil">Edible Oil ({edibleOil === undefined ? 'loading...' : edibleOil})</option>
              <option value="Sugar">Sugar ({sugar === undefined ? 'loading...' : sugar})</option>
            </select>
          </form>
        </Flex>
      </div>

      {flour === undefined ? <Spinner /> : <AssessmentChart
        industry={industry}
        industryScores={industryScores}
        filteredData={filteredData}
        mfiFlourData={mfiFlourData}
        SAFlour={SAFlour}
        IEGFlour={IEGFlour}
        PTFlour={PTFlour}
      />}
    </div>
  );
};

Performance.propTypes = {
  name: PropTypes.any,
};

export default Performance;
