import {Text, Flex, Spinner} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {request} from 'common';
import AssessmentCompany from './assessment-coy';

/**
 * CompanyScore component fetches and computes SAT, IEG, and PT scores for selected brands
 * across three product categories: Sugar, Flour, and Edible Oil. It also renders an assessment chart.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - Title of the dashboard component
 * @returns {JSX.Element} A dashboard displaying assessment metrics and a brand selection dropdown
 */
const CompanyScore = ({name}) => {
  // State for tracking selected industry and brand
  const [industry, setIndustry] = useState('Flour');
  const [brandDropDown, setBrand] = useState('1XZWpY9qXtIW4jLYdIKT');

  // 77, 98, 71, 19
  const [industryScores, setIndustryScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState();

  const [, setEdibleOil] = useState();
  const [flour, setFlour] = useState();
  const [, setSugar] = useState();
  // const toast = useToast();
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

  // const [SABrands, setSABrands] = useState();

  // Chart state for Edible Oil
  const [SAEdibleOils, setSAEdibleOils] = useState(0);
  const [IEGEdibleOils, setIEGEdibleOils] = useState(0);
  const [PTEdibleOils, setPTEdibleOils] = useState(0);
  const [MFIEdibleOils, setMFIEdibleOils] = useState(0);


  // Fetch company assessment data and compute SAT, IEG, and PT scores by product category
  const getCompanies = async () => {
    setLoading(true);
    console.log(loading);
    try {
      const {
        data: {data: res},
      } = await request().get(`/ranking-list?page-size=30`);
      const filteredResponse = res?.filter((x) => x.id !== 'akpQPiE0sFH2iwciggHd');

      const reFilteredResponse = filteredResponse?.filter((x) => x.iegScores.length && x.ivcScores.length && x.satScores.length);
      console.log('reFilteredResponse', reFilteredResponse);

      setFilteredData(reFilteredResponse);

      // Filter and aggregate assessment data for Edible Oil
      const dataEdibleOil = reFilteredResponse?.map((product) =>
        product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Edible Oil').map((x) => x?.name).length
      );

      // Filter and aggregate assessment data for Flour
      const dataFlour = reFilteredResponse?.map((product) =>
        product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Flour').map((x) => x?.name).length
      );

      // Filter and aggregate assessment data for Sugar
      const dataSugar = reFilteredResponse?.map((product) =>
        product?.brands.map((item) => item?.productType).filter((x) => x.name === 'Sugar').map((x) => x?.name).length
      );

      setEdibleOil(
        dataEdibleOil?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0)
      );
      setFlour(
        dataFlour?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0)
      );
      setSugar(
        dataSugar?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0)
      );

      // Brands SAT Charts
      console.log('filteredData', filteredData);
      const selfAssessmentBrand = reFilteredResponse?.filter((brand) =>
        brand.brands.find((x) => x.id === brandDropDown)
      );

      // Tier One Breakdown
      const tierOneSABrand = selfAssessmentBrand?.filter((x) => x?.tier.includes('TIER_1'));
      const tierOneSatBrand = tierOneSABrand
        ?.filter((x) => x.tier.includes('TIER_1'))
        .map((x) =>
          x.ivcScores.map((x) => x?.score).reduce(function (accumulator, currentValue) {
            return accumulator + currentValue;
          })
        );
      const percentageTierOneSatBrand = tierOneSatBrand?.map((x) => (x / 100) * 60);

      const tierOneSatBrandTotal = percentageTierOneSatBrand?.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      });
      console.log('selfAssessmentBrand', selfAssessmentBrand);

      // Tier Three Breakdown
      const tierThreeSABrand = selfAssessmentBrand?.filter((x) => x?.tier.includes('TIER_3'));
      console.log('tierThreeSABrand', tierThreeSABrand);
      const tierThreeSatBrandTotal = tierThreeSABrand
        ?.filter((x) => x.tier.includes('TIER_3'))
        .map((x) =>
          x.ivcScores.map((x) => x?.score).reduce(function (accumulator, currentValue) {
            return accumulator + currentValue;
          })
        );

      if (selfAssessmentBrand?.map((x) => x.tier === 'TIER_1')) {
        console.log('tierOneSatBrandTotal', tierOneSatBrandTotal);
        setSASugar(tierOneSatBrandTotal?.toFixed());
      } else {
        console.log('tierThreeSatBrandTotal', tierThreeSatBrandTotal);
        setSASugar(tierThreeSatBrandTotal?.toFixed());
      }

      // Sugar IEG Charts
      const industryExpertSugar = reFilteredResponse?.filter((brand) =>
        brand.brands.find((x) => x.productType.name.includes('Sugar'))
      );

      const culIndustryExpertSugar = industryExpertSugar?.map((x) =>
        x.iegScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0)
      );

      const totalIEGsugar =
        culIndustryExpertSugar?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0) / culIndustryExpertSugar.length;
      setIEGSugar(totalIEGsugar.toFixed());

      // Sugar PT Charts
      const filterSugar = reFilteredResponse?.filter((brand) =>
        brand.brands.find((x) => x.productType.value === 'Sugar')
      );

      const culProductTestingSugar = filterSugar?.map((x) =>
        x.brands.filter((x) => x.productType.name === 'Sugar')
      );

      const latestProductTestingSugar = culProductTestingSugar?.map((x) =>
        x.map((x) =>
          x.productTests.sort(
            (a, b) =>
              new Date(b.sample_production_date).getTime() -
              new Date(a.sample_production_date).getTime()
          )[0]
        )
      );

      const fortifyProductTestingSugar = latestProductTestingSugar?.map((x) =>
        x?.map((x) => x?.fortification)
      );

      const addProductTestingSugar = fortifyProductTestingSugar?.map((x) =>
        x.map((x) => x.score).reduce((sum, x) => sum + x, 0)
      );

      const totalProductTestingSugar =
        addProductTestingSugar?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0) / culProductTestingSugar.length;

      setPTSugar(totalProductTestingSugar.toFixed());

      // Flour SAT Charts
      const selfAssessmentFlour = reFilteredResponse?.filter((brand) =>
        brand.brands.find((x) => x.productType.name.includes('Flour'))
      );

      const culSelfAssessmentFlour = selfAssessmentFlour?.map((x) =>
        x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0)
      );

      const totalSATFlour =
        culSelfAssessmentFlour?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0) / culSelfAssessmentFlour.length;
      setSAFlour(totalSATFlour.toFixed());
      console.log('totalSATFlour', totalSATFlour);

      // Flour  IEG Charts
      const industryExpertFlour = reFilteredResponse?.filter((brand) =>
        brand.brands.find((x) => x.productType.name.includes('Flour'))
      );

      const culIndustryExpertFlour = industryExpertFlour?.map((x) =>
        x.iegScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0)
      );

      const totalIEGFlour =
        culIndustryExpertFlour?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0) / culIndustryExpertFlour.length;
      setIEGFlour(totalIEGFlour.toFixed());

      // Flour PT Charts
      const filterFlour = reFilteredResponse?.filter((brand) =>
        brand.brands.find((x) => x.productType.value === 'Flour')
      );

      const culProductTestingFlour = filterFlour?.map((x) =>
        x.brands.filter((x) => x.productType.name === 'Flour')
      );

      const latestProductTestingFlour = culProductTestingFlour?.map((x) =>
        x.map((x) =>
          x.productTests.sort(
            (a, b) =>
              new Date(b.sample_production_date).getTime() -
              new Date(a.sample_production_date).getTime()
          )[0]
        )
      );

      const fortifyProductTestingFlour = latestProductTestingFlour?.map((x) =>
        x?.map((x) => x?.fortification)
      );

      const addProductTestingFlour = fortifyProductTestingFlour?.map((x) =>
        x.map((x) => x.score).reduce((sum, x) => sum + x, 0)
      );

      const totalProductTestingFlour =
        addProductTestingFlour?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0) / culProductTestingFlour.length;

      setPTFlour(totalProductTestingFlour.toFixed());
      // Edible Oil SAT Charts
      const selfAssessmentEdibleOil = reFilteredResponse?.filter((brand) =>
        brand.brands.find((x) => x.productType.name.includes('Edible Oil'))
      );

      const culSelfAssessmentEdibleOil = selfAssessmentEdibleOil?.map((x) =>
        x.ivcScores.map((x) => x?.score).reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0)
      );

      const totalSATEdibleOil =
        culSelfAssessmentEdibleOil?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0) / culSelfAssessmentEdibleOil.length;

      setSAEdibleOils(totalSATEdibleOil.toFixed());

      // Edible Oil  IEG Charts
      const industryExpertEdibleOil = reFilteredResponse?.filter((brand) =>
        brand.brands.find((x) => x.productType.name.includes('Edible Oil'))
      );

      const culIndustryExpertEdibleOil = industryExpertEdibleOil?.map((x) =>
        x.iegScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0)
      );

      const totalIEGEdibleOil =
        culIndustryExpertEdibleOil?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0) / culIndustryExpertEdibleOil.length;
      setIEGEdibleOils(totalIEGEdibleOil.toFixed());

      // Edible Oil PT Charts
      const filterEdibleOil = reFilteredResponse?.filter((brand) =>
        brand.brands.find((x) => x.productType.value === 'Edible Oil')
      );

      const culProductTestingEdibleOil = filterEdibleOil?.map((x) =>
        x.brands.filter((x) => x.productType.name === 'Edible Oil')
      );

      const latestProductTestingEdibleOil = culProductTestingEdibleOil?.map((x) =>
        x.map((x) =>
          x.productTests.sort(
            (a, b) =>
              new Date(b.sample_production_date).getTime() -
              new Date(a.sample_production_date).getTime()
          )[0]
        )
      );

      const fortifyProductTestingEdibleOil = latestProductTestingEdibleOil?.map((x) =>
        x.map((x) => x?.fortification)
      );

      const addProductTestingEdibleOil = fortifyProductTestingEdibleOil?.map((x) =>
        x.map((x) => x?.score).reduce((sum, x) => sum + x, 0)
      );

      const totalProductTestingEdibleOil =
        addProductTestingEdibleOil?.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0) / culProductTestingEdibleOil.length;
      setPTEdibleOils(totalProductTestingEdibleOil.toFixed());

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
  // Fetch data on component mount
  useEffect(() => {
    getCompanies();
  }, []);

  // Brands SAT Charts
  const selfAssessmentBrand = filteredData?.filter((brand) => brand.brands.find((x) => x.id === brandDropDown));

  // Tier One Breakdown
  const tierOneSABrand = selfAssessmentBrand?.filter((x) => x?.tier.includes('TIER_1'));
  const tierOneSatBrand = tierOneSABrand?.filter((x) => x.tier.includes('TIER_1')).map((x) => x.ivcScores.map((x) => x?.score).reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }));
  const percentageTierOneSatBrand = tierOneSatBrand?.map((x) => x / 100 * 66);

  const tierOneSatBrandTotal = percentageTierOneSatBrand?.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);

  // Tier Three Breakdown
  const tierThreeSABrand = selfAssessmentBrand?.filter((x) => x?.tier.includes('TIER_3'));
  const tierThreeSatBrandCul = tierThreeSABrand?.filter((x) => x.tier.includes('TIER_3')).map((x) => x.ivcScores.map((x) => x?.score).reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0));

  const tierThreeSatBrandTotal = tierThreeSatBrandCul?.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);

  let SABrandsTierOne = 0;
  let SABrandsTierThree = 0;
  // const SABrands = 0;
  if ((selfAssessmentBrand?.map((x) => x.tier === 'TIER_1'))) {
    SABrandsTierOne = tierOneSatBrandTotal.toFixed();
  }
  if ((selfAssessmentBrand?.map((x) => x.tier === 'TIER_3'))) {
    SABrandsTierThree = tierThreeSatBrandTotal.toFixed();
  }

  // Brands IEG Charts
  const industryExpertGroupBrand = filteredData?.filter((brand) => brand.brands.find((x) => x.id === brandDropDown));
  console.log('industryExpertGroupBrand', industryExpertGroupBrand);
  const culIndustryExpertBrand = industryExpertGroupBrand?.map((x) => x.iegScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0));
  console.log('culIndustryExpertBrand', culIndustryExpertBrand);
  const totalIndustryExpertGroupBrand = culIndustryExpertBrand?.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);
  console.log('totalIndustryExpertGroupBrand', totalIndustryExpertGroupBrand);
  const IEGBrands = totalIndustryExpertGroupBrand;
  // Brands PT Charts
  const productTestingBrand = filteredData?.filter((brand) => brand.brands.find((x) => x.id === brandDropDown));
  // console.log('productTestingBrand', filteredData?.filter((brand) => brand.brands.find((x) => x.productTests)));


  const latestProductTestingBrand = productTestingBrand?.map(((x) => x.brands.map((x) => x.productTests.sort((a, b) => new Date(b.sample_production_date).getTime() - new Date(a.sample_production_date).getTime())[0])));

  // console.log('latestProductTestingBrand', latestProductTestingBrand?.map((x) => x.map((x) => x.brand_id === '1XZWpY9qXtIW4jLYdIKT')));
  console.log('latestProductTestingBrand', latestProductTestingBrand);

  const brandTesting = latestProductTestingBrand?.map((x) => x.find((x) => x.brand_id === brandDropDown));
  let productTestingBrandScore = 0;

  if (brandTesting?.length > 0) {
    if (brandTesting[0]?.product_type === 'XjGrnod6DDbJFVxtZDkD') {
      const productTestingResults = brandTesting[0]?.results;
      // productTestingBrandScore = product_testing_results.reduce((acc, item) => acc + (item.score), 0);
      const adjustedScores = productTestingResults.map(({percentage_compliance: compliance, ...others}) => ({...others, mfiScore: compliance >= 80 ? 20 : compliance >= 51 ? 10 : compliance >= 31 ? 5 : 0}));
      productTestingBrandScore = adjustedScores.reduce((accum, {mfiScore, microNutrient}) => accum + (microNutrient.name == 'Vitamin A'?(mfiScore*0.6):(mfiScore*0.2)), 0);
    } else {
      productTestingBrandScore = brandTesting[0]?.fortification?.score;
    }
  }

  const PTTesting = productTestingBrandScore;

  const satValueBrand = parseInt(SABrandsTierThree) === 0 ? parseInt(SABrandsTierOne) : parseInt(SABrandsTierOne) === 0 ? parseInt(SABrandsTierThree) : '';
  const ptWeightedScoreBrand = PTTesting;
  // console.log('ptWeightedScoreBrand', ptWeightedScoreBrand);
  const iegWeightedScoreBrand = (IEGBrands / 100) * 20;
  // console.log('iegWeightedScoreBrand', iegWeightedScoreBrand);
  const satWeightedScoreBrand = (satValueBrand / 100) * 60;
  // console.log('satWeightedScoreBrand', satWeightedScoreBrand);


  const MFIBrandTotalBrand = ptWeightedScoreBrand + iegWeightedScoreBrand + satWeightedScoreBrand;
  // console.log('MFIBrandTotalBrand', MFIBrandTotalBrand);
  /**
   * Updates the selected brand based on dropdown selection
   * @param {Event} e - The change event from the dropdown
   */
  const changeBrand = (e) => {
    setBrand(e.target.value);
  };

  // Compute MFI scores for Sugar, Flour, and Edible Oil based on SAT, IEG, PT inputs
  useEffect(() => {
    // Sugar MFI Charts
    const satValueSugar = SASugar;
    // console.log('satValueSugar', satValueSugar);
    const ptWeightedScoreSugar = PTSugar;
    // console.log('ptWeightedScoreSugar', ptWeightedScoreSugar);
    const iegWeightedScoreSugar = (IEGSugar / 100) * 20;
    // console.log('iegWeightedScoreSugar', iegWeightedScoreSugar);
    const satWeightedScoreSugar = (satValueSugar / 100) * 60;
    // console.log('satWeightedScoreSugar', satWeightedScoreSugar);
    const sugarMFITotalSugar = ptWeightedScoreSugar + iegWeightedScoreSugar + satWeightedScoreSugar;
    // console.log('sugarMFITotalSugar', sugarMFITotalSugar);
    setMFISugar(sugarMFITotalSugar.toFixed());

    // Flour MFI Charts
    const satValueFlour = SAFlour;
    // console.log('satValueFlour', satValueSugar);
    const ptWeightedScoreFlour = PTFlour;
    // console.log('ptWeightedScoreFlour', satValueSugar);
    const iegWeightedScoreFlour = (IEGFlour / 100) * 20;
    // console.log('iegWeightedScoreFlour', satValueSugar);
    const satWeightedScoreFlour = (satValueFlour / 100) * 60;
    // console.log('satWeightedScoreFlour', satValueSugar);
    const flourMFITotal = ptWeightedScoreFlour + iegWeightedScoreFlour + satWeightedScoreFlour;
    // console.log('flourMFITotal', satValueSugar);
    setMFIFlourData(flourMFITotal.toFixed());

    // Edible Oil MFI Charts
    const satValueEdibleOil = SAEdibleOils;
    // console.log('satValueEdibleOil', satValueSugar);
    const ptWeightedScoreEdibleOil = PTEdibleOils;
    // console.log('ptWeightedScoreEdibleOil', satValueSugar);
    const iegWeightedScoreEdibleOil = (IEGEdibleOils / 100) * 20;
    // console.log('iegWeightedScoreEdibleOil', iegWeightedScoreEdibleOil);
    const satWeightedScoreEdibleOil = (satValueEdibleOil / 100) * 60;
    // console.log('satWeightedScoreEdibleOil', satWeightedScoreEdibleOil);
    const edibleOilMFITotal = ptWeightedScoreEdibleOil + iegWeightedScoreEdibleOil + satWeightedScoreEdibleOil;
    // console.log('edibleOilMFITotal', edibleOilMFITotal);
    setMFIEdibleOils(edibleOilMFITotal.toFixed());
  });


  /**
   * Updates chart scores for the selected industry
   * @param {Event} e - The change event from the industry dropdown
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
        setIndustryScores([MFISugar, 87, IEGSugar, PTSugar]);
        break;
      default:
        break;
    }
  };

  console.log(changeScores);

  return (
    <div className="margin-top-5 background-color-white radius-large padding-5 border-1px">
      <div className="">
        <div>
          <Text className="margin-bottom-5 weight-medium" fontSize="15px" fontWeight="700">
            {name}
          </Text>
        </div>
        <Flex>
          {/* Render dropdown for brand selection */}
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
              value={brandDropDown}
              onChange={changeBrand}
              data-name="Field 2"
              className="border-1px rounded-large background-color-white w-select"
            >
              {filteredData?.map((brand) =>
                brand?.brands.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name === '' ? 'loading...' : x.name}
                  </option>
                ))
              )}
            </select>
          </form>
        </Flex>
      </div>

      {/* Conditionally render AssessmentCompany component once Flour data is available */}
      {flour === undefined ? (
        <Spinner />
      ) : (
        <AssessmentCompany
          industry={industry}
          industryScores={industryScores}
          filteredData={filteredData}
          MFIBrandTotalBrand={MFIBrandTotalBrand}
          SABrandsTierOne={SABrandsTierOne}
          SABrandsTierThree={SABrandsTierThree}
          IEGBrands={IEGBrands}
          PTTesting={PTTesting}
        />
      )}
    </div>
  );
};

CompanyScore.propTypes = {
  name: PropTypes.any,
};

export default CompanyScore;
