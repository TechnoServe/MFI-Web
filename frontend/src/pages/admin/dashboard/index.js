/* eslint-disable react/prop-types */
import React, {useState, useRef, useEffect} from 'react';
import ReactToPrint from 'react-to-print';
import {Flex, Text, Spinner, Divider, Stack, Select, Spacer} from '@chakra-ui/react';
// import AssessmentChart from './component/assessment-chart';
// import ProgressChart from './component/progress-chart';
import PieChart from './component/pie-chart';
import {nanoid} from '@reduxjs/toolkit';
import {Link} from 'react-router-dom';
import {usePagination} from 'components/usePagination';
import {usePaginationFlourButtons} from 'components/usePaginationFlour';
import {usePaginationEdibleOilButtons} from 'components/usePaginationEdibleOil';
import {usePaginationSugarButtons} from 'components/usePaginationSugar';
import Performance from './component/performance';
import CompanyScore from './component/company-score';
import {request} from 'common';

/**
 * Admin Dashboard component for displaying MFI performance data.
 * Handles fetching and filtering of company scores, industry-specific metrics,
 * and dynamically renders charts and ranked brand scores.
 *
 * @component
 * @returns {JSX.Element} The rendered dashboard UI for MFI assessment data
 */
const Dashboard = () => {
  // Track current industry selection (All, Flour, Edible Oil, Sugar)
  const [industry, setIndustry] = useState('All');
  // Loading state flag
  const [loading] = useState(false);
  // List of company names
  const [list, setList] = useState([]);
  // Full and filtered score datasets
  const [companyScores, setCompanyScores] = useState(list);
  const [companyFlourScores, setCompanyFlourScores] = useState(list);
  const [companyEdibleOilScores, setCompanyEdibleOilScores] = useState(list);
  const [companySugarScores, setCompanySugarScores] = useState(list);

  const {PaginationButtons, allIndustryScores} = usePagination(companyScores);

  const {PaginationFlourButtons, flourScores} = usePaginationFlourButtons(companyFlourScores);

  const {PaginationEdibleOilButtons, edibleOilScores} = usePaginationEdibleOilButtons(companyEdibleOilScores);

  const {PaginationSugarButtons, sugarScores} = usePaginationSugarButtons(companySugarScores);

  // Reference for printing component
  const componentRef = useRef();
  // State to track loading spinner for totals and charts
  const [spinning, setSpinning] = useState(false);
  // State for tracking total number of brands
  const [brandsTotal, setBrandsTotal] = useState([]);
  // Server response data
  const [response, setResponse] = useState([]);
  // MFI score values for all/specific industries
  const [mfiScore, setMfiScore] = useState([]);
  const [sugarScore, setSugarScore] = useState([]);
  const [edibleOilScore, setEdibleOilScore] = useState([]);
  const [flourScore, setFlourScore] = useState([]);
  // List of assessment cycles
  const [cycles, setCycles] = useState([]);
  const cycle = 'vJqDawZlrKNHsMIW9G2s';
  // Currently selected cycle ID
  const [selectedCycle, setSelectedCycle] = useState(cycle);

  // Fetch assessment cycles on component mount
  useEffect(() => {
    const getCycles = async () => {
      try {
        const res = await request(true).get(`/admin/cycles`);
        setCycles(res.data);
      } catch (error) {
        setLoading(false);
        return toast({
          status: 'error',
          title: 'Error',
          position: 'top-right',
          description: 'Something went wrong',
          duration: 6000,
          isClosable: true,
        });
      }
    };
    getCycles();
  }, []);

  /**
   * Fetch and filter companies from the backend based on selected cycle.
   * Sets score data for all industries and specific food vehicle categories.
   *
   * @returns {Promise<void>}
   */
  const getCompanyList = async () => {
    try {
      setSpinning(true);
      const res = await request(true).get(`admin/index?page-size=100`);
      setResponse(res);
      // Get and filter out companies with no relevant product tests
      let filteredResponse = res.data.filter((x) => x.id !== 'akpQPiE0sFH2iwciggHd');
      filteredResponse = filteredResponse.filter((x) => x.brands.filter((x) => x.productTests.filter((x) => x.results.filter((x) => x.cycle_id === selectedCycle)).length > 0).length > 0);

      console.log('filteredResponse', filteredResponse);
      // Further filter to ensure each company has all three required score types
      const reFilteredResponse = filteredResponse?.filter((x) => x.iegScores.length && x.ivcScores.length && x.satScores.length && (x.brands.length > 0 && x.brands[0].productTests.length>0));

      const resList = reFilteredResponse.map((list) => list.company_name);
      setCompanyScores(reFilteredResponse);

      // Separate filtered company scores into categories: Flour, Edible Oil, Sugar
      setCompanyFlourScores(reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.value === 'Flour')));
      setCompanyEdibleOilScores(reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.value === 'Edible Oil')));
      setCompanySugarScores(reFilteredResponse?.filter((brand) => brand.brands.find((x) => x.productType.value === 'Sugar')));

      setList(resList);
      // Count total brands across companies
      const brands = filteredResponse.map((x) => x?.brands?.map((x) => x?.name).length);
      setBrandsTotal((brands?.reduce((accum, item) => accum + item, 0)));

      // setEdibleOil(reFilteredResponse.filter((data) => data?.brands[0]?.productType?.name === 'Edible Oil'));
      // setFlour(reFilteredResponse.filter((data) => data?.brands[0]?.productType?.name === 'Flour'));
      // setSugar(reFilteredResponse.filter((data) => data?.brands[0]?.productType?.name === 'Sugar'));
      setSpinning(false);
    } catch (err) {
    }
  };

  /**
   * Updates selected cycle and refreshes company data
   * @param {Event} evt - The cycle dropdown change event
   */
  const onCycleChange = (evt) => {
    console.log(evt);
    const value = evt.target.options[evt.target.selectedIndex].value;
    setSelectedCycle(value);
    getCompanyList(value);
  };


  // Initial load of company performance data
  useEffect(() => {
    getCompanyList();
  }, []);

  // Load cached MFI scores from localStorage on render
  useEffect(() => {
    setMfiScore(localStorage.getItem('mfi') ? JSON.parse(localStorage.getItem('mfi')) || null : 78);
    setSugarScore(localStorage.getItem('sugarMFI') ? JSON.parse(localStorage.getItem('sugarMFI')) : 70);
    setFlourScore(localStorage.getItem('flourMFI') ? JSON.parse(localStorage.getItem('flourMFI')) : 83);
    setEdibleOilScore(localStorage.getItem('edibleOilMFI') ? JSON.parse(localStorage.getItem('edibleOilMFI')) : 71);
  });

  /**
   * Sets the industry filter for rendering score rankings
   * @param {Event} e - Dropdown change event
   */
  const setAllScores = (e) => {
    setIndustry(e.target.value);
    switch (e.target.value) {
      case 'All':
        // setCompanyScores(list);
        break;
      case 'Flour':
        // setCompanyScores(flour?.map((x) => x?.company_name));
        break;
      case 'Edible Oil':
        // setCompanyScores(edibleOil?.map((x) => x?.company_name));
        break;
      case 'Sugar':
        // setCompanyScores(sugar?.map((x) => x?.company_name));
        break;
      default:
        break;
    }
  };

  /**
   For All Industries
  * */
  // Compute SAT, IEG, and PT scores and total MFI score for each category
  let tierSatBrandTotal = [];
  tierSatBrandTotal = allIndustryScores?.map((x) => {
    return x.tier === 'TIER_1' ? x.ivcScores.map((x) => x.score / 100 * 60).reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0) : x.tier === 'TIER_3' ? x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0) : '';
  });

  // Brands IEG Charts
  let IEGBrands = [];
  IEGBrands = allIndustryScores?.map((x) => x.iegScores.map((x) => x.value).reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0));

  // Brands PT Charts
  let PTTesting = [];
  const latestProductTestingBrand = allIndustryScores?.map(((x) => x.brands.map((x) => x.productTests.sort((a, b) => new Date(b.sample_production_date).getTime() - new Date(a.sample_production_date).getTime())[0])));

  const brandTesting = latestProductTestingBrand?.map((x) => x?.find((x) => x?.brand_id));

  if (brandTesting?.length > 0) {
    PTTesting = brandTesting?.map((x) => x.fortification.score);
  }

  const satValueBrand = tierSatBrandTotal;
  const ptWeightedScoreBrand = (PTTesting.map((x) => x / 100 * 20));
  const iegWeightedScoreBrand = (IEGBrands.map((x) => x / 100 * 20));
  const satWeightedScoreBrand = (satValueBrand.map((x) => x / 100 * 60));
  let MFIBrandTotalBrand = [];
  MFIBrandTotalBrand = ptWeightedScoreBrand.map((val, idx) => val + iegWeightedScoreBrand[idx] + satWeightedScoreBrand[idx]);
  let sortMfiScore = [];
  sortMfiScore = allIndustryScores.map((v, i) => ({...v, mfiScore: MFIBrandTotalBrand[i]})).sort(function (a, b) {
    return b.mfiScore - a.mfiScore;
  });
  /**
 For Flour Industries
* */
  // Compute SAT, IEG, and PT scores and total MFI score for each category
  let tierSatBrandTotalFlour = [];
  tierSatBrandTotalFlour = flourScores?.map((x) => {
    return x.tier === 'TIER_1' ? x.ivcScores.map((x) => x.score / 100 * 60).reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0) : x.tier === 'TIER_3' ? x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0) : '';
  });

  // Brands IEG Charts
  let IEGBrandsFlour = [];
  IEGBrandsFlour = flourScores?.map((x) => x.iegScores.map((x) => x.value).reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0));

  // Brands PT Charts
  let PTTestingFlour = [];
  const latestProductTestingBrandFlour = flourScores?.map(((x) => x.brands.map((x) => x.productTests.sort((a, b) => new Date(b.sample_production_date).getTime() - new Date(a.sample_production_date).getTime())[0])));

  const brandTestingFlour = latestProductTestingBrandFlour?.map((x) => x.find((x) => x?.brand_id));

  if (brandTestingFlour?.length > 0) {
    PTTestingFlour = brandTestingFlour?.map((x) => x.fortification.score);
  }
  const satValueBrandFlour = tierSatBrandTotalFlour;
  const ptWeightedScoreBrandFlour = (PTTestingFlour.map((x) => x / 100 * 20));
  const iegWeightedScoreBrandFlour = (IEGBrandsFlour.map((x) => x / 100 * 20));
  const satWeightedScoreBrandFlour = (satValueBrandFlour.map((x) => x / 100 * 60));

  let MFIBrandTotalBrandFlour = [];

  MFIBrandTotalBrandFlour = ptWeightedScoreBrandFlour.map((val, idx) => val + iegWeightedScoreBrandFlour[idx] + satWeightedScoreBrandFlour[idx]);

  let sortMfiScoreFlour = [];
  sortMfiScoreFlour = flourScores.map((v, i) => ({...v, flourScore: MFIBrandTotalBrandFlour[i]})).sort(function (a, b) {
    return b.flourScore - a.flourScore;
  });

  /**
For Sugar Industries
* */
  // Compute SAT, IEG, and PT scores and total MFI score for each category
  let tierSatBrandTotalSugar = [];
  tierSatBrandTotalSugar = sugarScores?.map((x) => {
    return x.tier === 'TIER_1' ? x.ivcScores.map((x) => x.score / 100 * 60).reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0) : x.tier === 'TIER_3' ? x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0) : '';
  });

  console.log(tierSatBrandTotalSugar);

  // Brands IEG Charts
  let IEGBrandsSugar = [];
  IEGBrandsSugar = sugarScores?.map((x) => x.iegScores.map((x) => x.value).reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0));
  console.log(IEGBrandsSugar);
  // Brands PT Charts
  let PTTestingSugar = [];
  const latestProductTestingBrandSugar = sugarScores?.map(((x) => x.brands.map((x) => x.productTests.sort((a, b) => new Date(b.sample_production_date).getTime() - new Date(a.sample_production_date).getTime())[0])));

  const brandTestingSugar = latestProductTestingBrandSugar?.map((x) => x.find((x) => x.brand_id));

  if (brandTestingSugar?.length > 0) {
    PTTestingSugar = brandTestingSugar?.map((x) => x.fortification.score);
  }
  console.log(PTTestingSugar);
  const satValueBrandSugar = tierSatBrandTotalFlour;
  const ptWeightedScoreBrandSugar = (PTTestingFlour.map((x) => x / 100 * 20));
  const iegWeightedScoreBrandSugar = (IEGBrandsFlour.map((x) => x / 100 * 20));
  const satWeightedScoreBrandSugar = (satValueBrandSugar.map((x) => x / 100 * 60));

  let MFIBrandTotalBrandSugar = [];

  MFIBrandTotalBrandSugar = ptWeightedScoreBrandSugar.map((val, idx) => val + iegWeightedScoreBrandSugar[idx] + satWeightedScoreBrandSugar[idx]);

  let sortMfiScoreSugar = [];
  sortMfiScoreSugar = sugarScores.map((v, i) => ({...v, sugarScore: MFIBrandTotalBrandSugar[i]})).sort(function (a, b) {
    return b.sugarScore - a.sugarScore;
  });

  /**
For Edible Oil Industries
* */
  // Compute SAT, IEG, and PT scores and total MFI score for each category
  let tierSatBrandTotalEdibleOil = [];
  tierSatBrandTotalEdibleOil = edibleOilScores?.map((x) => {
    return x.tier === 'TIER_1' ? x.ivcScores.map((x) => x.score / 100 * 60).reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0) : x.tier === 'TIER_3' ? x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0) : '';
  });

  // Brands IEG Charts
  let IEGBrandsEdibleOil = [];
  IEGBrandsEdibleOil = edibleOilScores?.map((x) => x.iegScores.map((x) => x.value).reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0));

  // Brands PT Charts
  let PTTestingEdibleOil = [];
  const latestProductTestingBrandEdibleOil = edibleOilScores?.map(((x) => x.brands.map((x) => x.productTests.sort((a, b) => new Date(b.sample_production_date).getTime() - new Date(a.sample_production_date).getTime())[0])));


  const brandTestingEdibleOil = latestProductTestingBrandEdibleOil?.map((x) => x.find((x) => x.brand_id));

  if (brandTestingEdibleOil?.length > 0) {
    PTTestingEdibleOil = brandTestingEdibleOil?.map((x) => x.fortification.score);
  }
  const satValueBrandEdibleOil = tierSatBrandTotalEdibleOil;
  const ptWeightedScoreBrandEdibleOil = (PTTestingEdibleOil.map((x) => x / 100 * 20));
  const iegWeightedScoreBrandEdibleOil = (IEGBrandsEdibleOil.map((x) => x / 100 * 20));
  const satWeightedScoreBrandEdibleOil = (satValueBrandEdibleOil.map((x) => x / 100 * 60));

  let MFIBrandTotalBrandEdibleOil = [];

  MFIBrandTotalBrandEdibleOil = ptWeightedScoreBrandEdibleOil.map((val, idx) => val + iegWeightedScoreBrandEdibleOil[idx] + satWeightedScoreBrandEdibleOil[idx]);

  let sortMfiScoreEdibleOil = [];
  sortMfiScoreEdibleOil = edibleOilScores.map((v, i) => ({...v, edibleOilScore: MFIBrandTotalBrandEdibleOil[i]})).sort(function (a, b) {
    return b.edibleOilScore - a.edibleOilScore;
  });

  // Render industry dropdown, download button, and chart blocks
  // Conditional rendering for average scores by selected industry
  // Show ProgressChart bars with brand and industry MFI comparisons
  return loading ? (
    <Flex height="100%" width="100%" mb="10" justifyContent="center" alignItems="center">
      <Spinner />
    </Flex>
  ) : (
    <div className="padding-0 background-color-4 w-col w-col-10" style={{width: '100%'}}>
      <div className="background-color-white padding-x-10 padding-y-6 border-bottom-1px sticky-top-0 flex-row-middle flex-space-between">
        <Flex direction="row" justify="space-between" width="70rem" alignItems="center">
          {/* <CustomSelect filter={sorted} placeholder="Sort" onChange={sortCompany} /> */}
          <h5 className="page-title">Dashboard</h5>
          <Spacer />
          <Select size='md' style={{marginTop: '9px', marginLeft: '10px', marginRight: '10px'}} name="cycles" id="cycles" onChange={onCycleChange}>
            {
              cycles?.map((x) => (
                selectedCycle==x.id?(
                  <option selected key={x.id} value={x.id}>{x.name} Cycle</option>
                ):(
                  <option key={x.id} value={x.id}>{x.name} Cycle</option>
                )
              ))
            }
          </Select>
          <Spacer />
          <ReactToPrint
            trigger={() => (
              <button className="flex-row-middle padding-x-4 padding-y-2 background-brand rounded-large text-color-4 no-underline w-inline-block">
                <div className="padding-right-2 text-small text-color-4">Download</div>
              </button>
            )}
            content={() => componentRef.current}
          />
        </Flex>
      </div>
      <div className="padding-10" ref={componentRef}>
        <div>
          <Flex flexDirection="row" flexWrap="wrap">
            <Flex
              className="background-color-white border-1px rounded-large padding-5"
              key={nanoid()}
              flexDirection="column"
              width="340px"
              m={3}
            >
              <Text className="margin-bottom-1 weight-medium" fontSize="18px" fontWeight="700">
                Total Brands
              </Text>
              <Text className="margin-bottom-2 weight-medium" fontSize="44px" fontWeight="700">
                {(spinning && <Spinner />) || brandsTotal}
              </Text>
            </Flex>
            {/** */}
            <Flex
              className="background-color-white border-1px rounded-large padding-5"
              key={nanoid()}
              flexDirection="column"
              width="340px"
              m={3}
            >
              <Text
                className="margin-bottom-1 weight-medium"
                mb={5}
                fontSize="18px"
                fontWeight="700"
              >
                Industry Breakdown
              </Text>
              <PieChart
                response={response}
                bg={[
                  'rgb(103, 197, 134)',
                  'rgb(233, 246, 237)',
                  'rgb(169, 222, 186)',
                  'rgb(200, 234, 211)',
                ]}
              />
            </Flex>
            {/** */}
            <Flex
              className="background-color-white border-1px rounded-large padding-5"
              key={nanoid()}
              flexDirection="column"
              width="340px"
              m={3}
            >
              <Text className="margin-bottom-1 weight-medium" fontSize="18px" fontWeight="700">
                Average Score for{' '}
                <Link to="/admin/dashboard" style={{textDecoration: 'underline', color: 'gray'}}>
                  all industries
                </Link>
              </Text>
              <Text className="margin-bottom-2 weight-medium" fontSize="44px" fontWeight="700">
                {mfiScore}%
              </Text>
            </Flex>
          </Flex>
          {/** TOP */}
          <Performance name={'MFI Performance By Fortified Staple Food Vehicle'} />
          <div className="margin-top-5 background-color-white radius-large padding-5 border-1px">
            <div>
              <div>
                <Text className="margin-bottom-5 weight-medium" fontSize="15px" fontWeight="700">
                  Brand Score vs Industry Average
                </Text>
                <div className="text-small text-color-body-text margin-top-2 margin-bottom-2">
                  Brand scores are compared with the average industry score
                </div>
              </div>
              <Flex>
              </Flex>
            </div>
            <CompanyScore />
          </div>
          <div className="margin-top-5 background-color-white radius-large padding-5 border-1px">
            <div>
              <div>
                <Text className="margin-bottom-5 weight-medium" fontSize="15px" fontWeight="700">
                  All Scores
                </Text>
                <div className="text-small text-color-body-text margin-top-2 margin-bottom-2">
                  All ranked company scores compared with the average industry scores
                </div>
              </div>
              <Flex>
                <form
                  id="email-form"
                  name="email-form"
                  data-name="Email Form"
                  className="flex-row-middle"
                  style={{width: 200, padding: 10}}
                >
                  <select
                    id="field-2"
                    name="field-2"
                    onChange={setAllScores}
                    data-name="Field 2"
                    className="border-1px rounded-large background-color-white w-select"
                  >
                    <option value="All">All industries</option>
                    <option value="Flour">Wheat Flour</option>
                    <option value="Edible Oil">Edible Oil</option>
                    <option value="Sugar">Sugar</option>
                  </select>
                </form>
                <form
                  id="email-form"
                  name="email-form"
                  data-name="Email Form"
                  className="flex-row-middle"
                  style={{width: 350, padding: 10}}
                >
                </form>
              </Flex>
            </div>
            <Divider />
            {/* All Industries */}
            {industry === 'All' ?
                <Flex paddingX="60px" paddingY="30px" flexDirection="column">
                  {(spinning && <Spinner />) || sortMfiScore?.map((x) => (
                    <div key={nanoid()}>
                      <Flex mb={8} mt={8}>
                        <Text className="margin-bottom-1" fontSize="16px" mr={10} style={{width: '100px'}}>
                          {x?.company_name}
                        </Text>
                        <Stack flex={1} alignSelf="center">
                          {/* <ProgressChart size={rangeScore} range={74} /> */}
                          <div className="progress-bar">
                            <div style={{
                              width: `${x?.mfiScore}%`
                            }} className="progress"></div>
                            <div style={{width: `${mfiScore}%`}} className="progress2"></div>
                          </div>
                        </Stack>
                      </Flex>
                      <Divider />
                    </div>
                  ))}
                  <PaginationButtons />
                </Flex>
              :
              industry === 'Flour' ?
                  <Flex paddingX="60px" paddingY="30px" flexDirection="column">
                    {(spinning && <Spinner />) || sortMfiScoreFlour?.map((x) => (
                      <div key={nanoid()}>
                        <Flex mb={8} mt={8}>
                          <Text className="margin-bottom-1" fontSize="16px" mr={10} style={{width: '100px'}}>
                            {x?.company_name}
                          </Text>
                          <Stack flex={1} alignSelf="center">
                            {/* <ProgressChart size={rangeScore} range={74} /> */}
                            <div className="progress-bar">
                              <div style={{width: `${x?.flourScore}%`}} className="progress"></div>
                              <div style={{width: `${flourScore}%`}} className="progress2"></div>
                            </div>
                          </Stack>
                        </Flex>
                        <Divider />
                      </div>
                    ))}
                    <PaginationFlourButtons />
                  </Flex>
                :
                industry === 'Edible Oil' ?
                    <Flex paddingX="60px" paddingY="30px" flexDirection="column">
                      {(spinning && <Spinner />) || sortMfiScoreEdibleOil?.map((x) => (
                        <div key={nanoid()}>
                          <Flex mb={8} mt={8}>
                            <Text className="margin-bottom-1" fontSize="16px" mr={10} style={{width: '100px'}}>
                              {x?.company_name}
                            </Text>
                            <Stack flex={1} alignSelf="center">
                              {/* <ProgressChart size={rangeScore} range={74} /> */}
                              <div className="progress-bar">
                                <div style={{width: `${x?.edibleOilScore}%`}} className="progress"></div>
                                <div style={{width: `${edibleOilScore}%`}} className="progress2"></div>
                              </div>
                            </Stack>
                          </Flex>
                          <Divider />
                        </div>
                      ))}
                      <PaginationEdibleOilButtons />
                    </Flex>
                  :
                  industry === 'Sugar' ?
                      <Flex paddingX="60px" paddingY="30px" flexDirection="column">
                        {(spinning && <Spinner />) || sortMfiScoreSugar?.map((x) => (
                          <div key={nanoid()}>
                            <Flex mb={8} mt={8}>
                              <Text className="margin-bottom-1" fontSize="16px" mr={10} style={{width: '100px'}}>
                                {x?.company_name}
                              </Text>
                              <Stack flex={1} alignSelf="center">
                                {/* <ProgressChart size={rangeScore} range={74} /> */}
                                <div className="progress-bar">
                                  <div style={{width: `${x?.sugarScore}%`}} className="progress"></div>
                                  <div style={{width: `${sugarScore}%`}} className="progress2"></div>
                                </div>
                              </Stack>
                            </Flex>
                            <Divider />
                          </div>
                        ))}
                        <PaginationSugarButtons />
                      </Flex>
                    : ''
            }
          </div>
        </div>
        <div className="border-top-1px margin-top-10 padding-top-5 flex-space-between">
          <div className="text-xs text-color-body-text">© Copyright MFI. All rights reserved</div>
          <div className="text-xs text-color-body-text">
            Powered by{' '}
            <a href=" https://www.technoserve.org/" target="_blank">
              TechnoServe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
