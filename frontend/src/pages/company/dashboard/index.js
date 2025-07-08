/* eslint-disable react/prop-types */
import React, {useState, useEffect, useRef} from 'react';
import {Bar} from 'react-chartjs-2';
import ReactToPrint from 'react-to-print';
import {PieChart, Pie, Cell, Sector} from 'recharts';
import {Flex, Text, useToast, Spinner, Select, Spacer} from '@chakra-ui/react';
import AssessmentChart1 from './component/assessment-chart-1';
import ProgressChart from './component/progress-chart';
import {useSelector} from 'react-redux';
import {request} from 'common';
import {nanoid} from '@reduxjs/toolkit';

import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [upgrading, setUpgrading] = useState(null);
  const [companyTier, setCompanyTier] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);

  const toast = useToast();
  // const [testing, setTesting] = useState('Flour');
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState([]);

  const [satData, setSATData] = useState([]);
  const [companySATScores, setCompanySATScores] = useState([]);
  const [satTotalScore, setSATTotalScore] = useState(0);

  const [ivcData, setIVCData] = useState([]);
  const [companyIVCScores, setCompanyIVCScores] = useState([]);
  const [ivcTotalScore, setIVCTotalScore] = useState(0);

  const [iegData, setIEGData] = useState([]);
  const [companyIEGScores, setCompanyIEGScores] = useState([]);
  const [iegTotalScore, setIEGTotalScore] = useState(0);

  const [ptData, setPTData] = useState([]);
  const [ptTotalScore, setPTTotalScore] = useState(0);

  const [productTestData, setProductTestData] = useState([]);

  const [overallWeightedScore, setOverallWeightedScore] = useState(0);
  const [companyBrandDetails, setCompanyBrandDetails] = useState([]);
  const [productTestingChart, setProductTestingChart] = useState();
  const [cycles, setCycles] = useState([]);
  const cycle = 'vJqDawZlrKNHsMIW9G2s';
  const [selectedCycle, setSelectedCycle] = useState(cycle);
  const [selectedCycleObj, setSelectedCycleObj] = useState({});

  // const [productTestResult, setProductTestResult] = useState([]);

  const [brandDropDown, setBrand] = useState();


  const user = useSelector((state) => state.auth.user);
  const componentRef = useRef();

  const [activeIndex] = useState(0);

  /**
   * Handles the change of selected assessment cycle from the dropdown.
   * Updates the selected cycle and fetches all relevant scores for the new cycle.
   * @param {React.ChangeEvent<HTMLSelectElement>} evt - The event object from the select input.
   * @returns {void}
   */
  const onCycleChange = (evt) => {
    setLoading(true);
    // Get the selected cycle id from the dropdown
    const value = evt.target.options[evt.target.selectedIndex].value;
    // Find the cycle object matching the selected id
    const mCycle = cycles.find((x) => x.id === value);
    setSelectedCycle(value);
    setSelectedCycleObj(cycles.find((x) => x.id === value));
    // Fetch all scores for the selected cycle
    getIEGScores(mCycle);
    getIVCScores(mCycle);
    getTestScores(mCycle);
    getSATScores(mCycle);
    getPTScores(mCycle);
  };

  /**
   * Fetches assessment cycles for the current company and initializes scores.
   * Sets the latest cycle as the selected cycle.
   * @returns {Promise<void>}
   */
  const getCycles = async () => {
    // setLoading(true);
    try {
      // Fetch all available assessment cycles for the company
      const res = await request(true).get(`/company/cycles`);
      setCycles(res.data);
      // Select the most recent cycle (last in the array)
      const mCycle = res.data[res.data.length - 1];
      setSelectedCycle(mCycle.id);
      setSelectedCycleObj(mCycle);
      // Fetch all assessment and test scores for the selected cycle
      getIEGScores(mCycle);
      getIVCScores(mCycle);
      getTestScores(mCycle);
      getSATScores(mCycle);
      getPTScores(mCycle);
      // setLoading(false);
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

  // const getActiveCycle = async () => {
  //   try {
  //     const {data: res} = await request(true).get(
  //       `/company/active-cycle`
  //     );


  //     setCycle(res);
  //     getIEGScores(res);
  //     getIVCScores(res);
  //   } catch (error) {
  //   }
  // };

  /**
   * Fetches and sets details about the current company, including tier.
   * @returns {Promise<void>}
   */
  const getCompanyDetails = async () => {
    try {
      // Fetch company details using the current user's company id
      const {data: res} = await request(true).get(
        `/company/details/?company-id=${user.company.id}`
      );
      setCompanyTier(res.company.tier);
      setCompanyDetails(res.company);
    } catch (error) {
      // Handle error if needed
    }
  };

  /**
   * Upgrades the current company to Tier 3.
   * Shows a toast notification on success.
   * @returns {Promise<void>}
   */
  const upgrade = async () => {
    setUpgrading(true);
    try {
      // Send a request to upgrade the company's tier to TIER_3
      await request(true).post(`/company/set-tier`, {
        'tier': 'TIER_3',
        'company-id': user.company_user.company_id,
      });
      setUpgrading(false);
      setCompanyTier('TIER_3');
      onCloseModal();
      return toast({
        status: 'success',
        title: 'You have upgraded!',
        position: 'top-right',
        description: 'Check your Self Assessment Tool for new requirements',
        duration: 6000,
        isClosable: true,
      });
    } catch (error) {
      setUpgrading(false);
      // Optionally show an error toast here
    }
  };

  /**
   * Fetches SAT, IEG, or PT test scores for the specified cycle.
   * @param {Object} cyc - The cycle object for which to fetch scores.
   * @returns {Promise<void>}
   */
  const getTestScores = async (cyc) => {
    try {
      // Fetch test scores for the given company and cycle
      const {
        data: {data: res},
      } = await request(true).get(`/sat/scores?company-id=${user.company.id}&cycle-id=${cyc.id}`);
      // Sort the results by sort_order for consistent display
      setScores(res.sort((a, b) => a.sort_order - b.sort_order));
      setLoading(false);
    } catch (error) {
      console.log('error getTestScores', error);
      setLoading(false);
      // Optionally show an error toast here
    }
  };

  /**
   * Fetches SAT and IVC data (ranking-list) for the given cycle.
   * @param {Object} cyc - The cycle object for which to fetch SAT scores.
   * @returns {Promise<void>}
   */
  const getSATScores = async (cyc) => {
    try {
      // Fetch ranking list for SAT and IVC for the given cycle
      const {
        data: {data: res},
      } = await request(true).get(`/ranking-list?page-size=50&cycle-id=${cyc.id}`);
      // Store SAT and IVC data for further processing
      setSATData(res);
      setIVCData(res);
    } catch (error) {
      console.log('error getSATScores', error);
      setLoading(false);
      // Optionally show an error toast here
    }
  };

  /**
   * Fetches Industry Expert Group (IEG) scores for the specified cycle.
   * @param {Object} cyc - The cycle object for which to fetch IEG scores.
   * @returns {Promise<void>}
   */
  const getIEGScores = async (cyc) => {
    try {
      // Fetch IEG scores for the given company and cycle
      const {
        data: {data: res},
      } = await request(true).get(
        `/company/ieg?cycle-id=${cyc.id}&company-id=${user.company.id}`
      );
      setIEGData(res);
    } catch (error) {
      setLoading(false);
      // Optionally show an error toast here
    }
  };

  /**
   * Fetches IVC (Independent Validation Committee) scores for the specified cycle.
   * @param {Object} cyc - The cycle object for which to fetch IVC scores.
   * @returns {Promise<void>}
   */
  const getIVCScores = async (cyc) => {
    try {
      // Fetch IVC scores for the given company and cycle
      await request(true).get(
        `/company/ivc?cycle-id=${cyc.id}&company-id=${user.company.id}`
      );
      // setIVCData(data?.responses); // Data is handled elsewhere
    } catch (error) {
      setLoading(false);
      // Optionally show an error toast here
    }
  };

  /**
   * Fetches Product Testing (PT) scores for the specified cycle.
   * @param {Object} cyc - The cycle object for which to fetch PT scores.
   * @returns {Promise<void>}
   */
  const getPTScores = async (cyc) => {
    try {
      // Fetch product testing scores for the given company and cycle
      const {
        data: {data: res},
      } = await request(true).get(`companies/${user.company.id}/products-tests?cycle-id=${cyc.id}`);
      setPTData(res);
      setLoading(false);
    } catch (error) {
      console.log('error getPTScores', error);
      setLoading(false);
      // Optionally show an error toast here
    }
  };

  // When the user object changes, fetch cycles and company details if company is present
  useEffect(() => {
    user.company && getCycles();
    user.company && getCompanyDetails();
  }, [user]);

  /**
   * Aggregates and computes overall and category-level scores when assessment data changes.
   * Updates state for SAT, IEG, IVC, PT, and overall weighted scores.
   */
  useEffect(() => {
    // Filter company's SAT data to extract brand-level data
    const filteredCompanyBrand =
      satData.length > 0
        ? satData.filter((item) => {
          return item.id === user.company.id;
        })
        : [];

    setCompanyBrandDetails(filteredCompanyBrand);
    // Set default selected brand and product testing chart for the first brand
    setBrand(filteredCompanyBrand[0]?.brands[0]?.id);
    setProductTestingChart(filteredCompanyBrand[0]?.brands[0]?.productTests[0]?.fortification?.score);

    // Compute SAT category scores and total
    const satScoresArr = [];
    const satTotalScoreArr = [];
    if (filteredCompanyBrand.length > 0 && filteredCompanyBrand[0].satScores.length > 0) {
      filteredCompanyBrand[0].satScores.forEach((categoryObj) => {
        // Compute category-wise SAT score as percent of max possible
        switch (categoryObj?.name) {
          case 'Personnel':
            satScoresArr[0] = (categoryObj.score / 23) * 100;
            satTotalScoreArr[0] = categoryObj.score;
            break;
          case 'Production':
            satScoresArr[1] = (categoryObj.score / 20) * 100;
            satTotalScoreArr[1] = categoryObj.score;
            break;
          case 'Procurement & Suppliers':
            satScoresArr[2] = (categoryObj.score / 15) * 100;
            satTotalScoreArr[2] = categoryObj.score;
            break;
          case 'Public Engagement':
            satScoresArr[3] = (categoryObj.score / 17) * 100;
            satTotalScoreArr[3] = categoryObj.score;
            break;
          case 'Governance':
            satScoresArr[4] = (categoryObj.score / 25) * 100;
            satTotalScoreArr[4] = (categoryObj.score);
            break;
        }
      });
    }

    // Set total SAT score for all categories
    if (satTotalScoreArr.length > 0) {
      setSATTotalScore(satTotalScoreArr.reduce((prevIter, item) => prevIter + item));
    }

    // Product Test: set product test data and PT total score for the first brand
    if (filteredCompanyBrand.length > 0 && filteredCompanyBrand[0].brands.length > 0) {
      setProductTestData(filteredCompanyBrand[0]?.brands[0]?.productTests);
      setPTTotalScore(filteredCompanyBrand[0]?.brands[0]?.productTests[0]?.fortification?.score);
    }

    // Compute IEG (Industry Expert Group) scores and total
    const iegScoresArr = [];
    const iegTotalScoreArr = [];
    // console.log('iegData', iegData);
    if (iegData?.length > 0) {
      iegData?.forEach((item) => {
        // Compute category-wise IEG score as percent of max possible
        switch (item.category?.name) {
          case 'Personnel':
            iegScoresArr[0] = (item.score?.toFixed() / 23) * 100;
            iegTotalScoreArr[0] = parseInt(item.score);
            break;
          case 'Production':
            iegScoresArr[1] = (item.score?.toFixed() / 20) * 100;
            iegTotalScoreArr[1] = parseInt(item.score);
            break;
          case 'Procurement & Suppliers':
            iegScoresArr[2] = (item.score?.toFixed() / 15) * 100;
            iegTotalScoreArr[2] = parseInt(item.score);
            break;
          case 'Public Engagement':
            iegScoresArr[3] = (item.score?.toFixed() / 17) * 100;
            iegTotalScoreArr[3] = parseInt(item.score);
            break;
          case 'Governance':
            iegScoresArr[4] = (item.score?.toFixed() / 25) * 100;
            iegTotalScoreArr[4] = parseInt(item.score);
            break;
        }
      });
    }

    // Set total IEG score for all categories
    if (iegTotalScoreArr.length > 0) {
      setIEGTotalScore(iegTotalScoreArr.reduce((prevIter, item) => prevIter + item));
    }

    // Compute IVC (Independent Validation Committee) scores and total
    const newIVCData = companyBrandDetails[0]?.ivcScores;
    const ivcScoresArr = [];
    const ivcTotalScoreArr = [];
    if (newIVCData?.length > 0) {
      newIVCData?.forEach((item) => {
        // Compute category-wise IVC score as percent of max possible
        switch (item?.name) {
          case 'Personnel':
            ivcScoresArr[0] = (item.score / 23) * 100;
            ivcTotalScoreArr[0] = item.score;
            break;
          case 'Production':
            ivcScoresArr[1] = (item.score / 20) * 100;
            ivcTotalScoreArr[1] = item.score;
            break;
          case 'Procurement & Suppliers':
            ivcScoresArr[2] = (item.score / 15) * 100;
            ivcTotalScoreArr[2] = item.score;
            break;
          case 'Public Engagement':
            ivcScoresArr[3] = (item.score / 17) * 100;
            ivcTotalScoreArr[3] = item.score;
            break;
          case 'Governance':
            ivcScoresArr[4] = (item.score / 25) * 100;
            ivcTotalScoreArr[4] = item.score;
            break;
        }
      });
    }

    // Set total IVC score for all categories (with tier-based adjustment)
    if (ivcTotalScoreArr.length > 0) {
      let totalScore = ivcTotalScoreArr.reduce((prevIter, item) => prevIter + item);
      // If company is Tier 1, scale the score to 60%
      if (companyBrandDetails[0]?.tier == 'TIER_1') {
        totalScore = totalScore / 100 * 60;
        // console.log('companyBrandDetails', companyBrandDetails);
      }
      setIVCTotalScore(totalScore);
    }

    // Set computed arrays for charts
    setCompanySATScores(satScoresArr);
    setCompanyIEGScores(iegScoresArr);
    setCompanyIVCScores(ivcScoresArr);

    // Compute overall weighted score: PT (20%), IEG (20%), SAT/IVC (60%)
    const loadData = async () => {
      // Use IVC total score if available, otherwise SAT total score
      const satValue = (await typeof ivcTotalScore) !== 'undefined' ? ivcTotalScore : satTotalScore;
      const ptWeightedScore = (await ptTotalScore);
      const iegWeightedScore = ((await iegTotalScore) / 100) * 20;
      const satWeightedScore = ((await satValue) / 100) * 60;
      setOverallWeightedScore(ptWeightedScore + iegWeightedScore + satWeightedScore);
    };
    loadData();
    // Compliance Score
  }, [satData, iegData, ivcData, ptData, overallWeightedScore]);

  // console.log('ptTotalScore', ptTotalScore);
  // console.log('iegTotalScore', iegTotalScore);
  // console.log('ivcTotalScore', ivcTotalScore);
  // console.log('satTotalScore', satTotalScore);
  // console.log('ptTotalScore', ptTotalScore);

  // const scoreWeighting = async () => {
  // Overall Weighted Score

  // };
  // scoreWeighting();

  /**
   * Sets the current product testing details for the selected brand.
   * Updates product testing chart, PT data, PT total score, and brand dropdown value.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The event object from the select input.
   * @returns {void}
   */
  const setPT = (e) => {
    // Parse the selected brand object from the dropdown value
    const selectedBrand = JSON.parse(e.target.value);
    // Set the product testing chart score for the first product test
    setProductTestingChart(selectedBrand?.productTests[0]?.fortification?.score);
    // Set product test data for the selected brand
    setProductTestData(selectedBrand?.productTests);
    // Set PT total score for the first product test
    setPTTotalScore(selectedBrand?.productTests[0]?.fortification?.score);
    // Set the selected brand id for the dropdown
    setBrand(selectedBrand?.id);
  };


  // Brands SAT Charts
  const selfAssessmentBrand = companyBrandDetails?.filter((brand) => brand.brands.find((x) => x.id === brandDropDown));

  // Tier One Breakdown
  const tierOneSABrand = selfAssessmentBrand?.filter((x) => x?.tier?.includes('TIER_1'));
  const tierOneSatBrand = tierOneSABrand?.filter((x) => x?.tier?.includes('TIER_1')).map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }));
  const percentageTierOneSatBrand = tierOneSatBrand?.map((x) => x / 100 * 60);
  console.log('percentageTierOneSatBrand', percentageTierOneSatBrand);

  const tierOneSatBrandTotal = percentageTierOneSatBrand?.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);

  // Tier Three Breakdown
  const tierThreeSABrand = selfAssessmentBrand?.filter((x) => x?.tier?.includes('TIER_3'));
  const tierThreeSatBrandCul = tierThreeSABrand?.filter((x) => x?.tier?.includes('TIER_3')).map((x) => x.ivcScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0));

  const tierThreeSatBrandTotal = tierThreeSatBrandCul?.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);

  let SABrandsTierOne = 0;
  let SABrandsTierThree = 0;
  // const SABrands = 0;
  if ((selfAssessmentBrand?.map((x) => x?.tier === 'TIER_1'))) {
    SABrandsTierOne = tierOneSatBrandTotal.toFixed();
  }
  if ((selfAssessmentBrand?.map((x) => x?.tier === 'TIER_3'))) {
    SABrandsTierThree = tierThreeSatBrandTotal.toFixed();
  }

  // Brands IEG Charts
  const industryExpertGroupBrand = companyBrandDetails?.filter((brand) => brand.brands.find((x) => x.id === brandDropDown));

  const culIndustryExpertBrand = industryExpertGroupBrand?.map((x) => x.iegScores.map((x) => x.score).reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0));

  const totalIndustryExpertGroupBrand = culIndustryExpertBrand?.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);
  let IEGBrands = [];
  IEGBrands = totalIndustryExpertGroupBrand?.toFixed();


  // Brands PT Charts
  const productTestingBrand = companyBrandDetails?.filter((brand) => brand.brands.find((x) => x.id === brandDropDown));

  const latestProductTestingBrand = productTestingBrand?.map(((x) => x.brands.map((x) => x.productTests?.sort((a, b) => new Date(b.sample_production_date).getTime() - new Date(a.sample_production_date).getTime())[0])));

  const brandTesting = latestProductTestingBrand?.map((x) => x?.find((x) => x?.brand_id === brandDropDown));
  let productTestingBrandScore = 0;

  if (brandTesting?.length > 0) {
    productTestingBrandScore = brandTesting[0]?.fortification?.score;
  }

  let PTTesting = [];
  PTTesting = productTestingBrandScore? productTestingBrandScore.toFixed():0;

  const satValueBrand = parseInt(SABrandsTierThree) === 0 ? parseInt(SABrandsTierOne) : parseInt(SABrandsTierOne) === 0 ? parseInt(SABrandsTierThree) : '';
  console.log('satValueBrand', satValueBrand);
  const ptWeightedScoreBrand = parseInt(PTTesting);
  const iegWeightedScoreBrand = ((IEGBrands / 100)) * 20;
  const satWeightedScoreBrand = (satValueBrand / 100) * 60;


  const MFIBrandTotalBrand = ptWeightedScoreBrand + iegWeightedScoreBrand + satWeightedScoreBrand;


  // const companyBrands = companyBrandDetails?.map((x) => x.brands.map((x) => x.name));
  // const productType = companyBrandDetails?.map((x) => x.brands.map((x) => x.productType.name));
  // const productDuplicates = productType[0]?.some((e, i, arr) => arr.indexOf(e) !== i);

  const data = [
    {name: 'Group B', value: MFIBrandTotalBrand, color: '#04B279'},
    {name: 'Group A', value: 100 - MFIBrandTotalBrand, color: '#f8f8fa'},
  ];
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

  // let initialPTValue = [];
  // initialPTValue = companyBrandDetails[0]?.brands[0]?.productTests[0]?.fortification?.score;

  /**
   * Custom rendering function for the active shape in the PieChart.
   * Displays the percentage value in the center and highlights the sector.
   * @param {Object} props - The properties for the active shape.
   * @returns {React.ReactNode}
   */
  const renderActiveShape = (props) => {
    const {cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, value} = props;
    return (
      <>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          style={{fontSize: 44, fontWeight: '700'}}
          fill={'#000'}
        >
          {`${value.toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </>
    );
  };

  return loading ? (
    <Flex height="100%" width="100%" mb="10" justifyContent="center" alignItems="center">
      <Spinner />
    </Flex>
  ) : (
    <div className="padding-0 background-color-4 w-col w-col-10" style={{width: '100%'}}>
      <div className="background-color-white padding-x-10 padding-y-6 border-bottom-1px sticky-top-0 flex-row-middle flex-space-between">
        <div className="flex items-center">
          <img
            src={`https://ui-avatars.com/api/?background=random&name=${companyDetails?.company_name.trim()}$rounded=true`}
            loading="lazy"
            width="48"
            style={{borderRadius: '50%'}}
            alt=""
            className="rounded-large margin-right-4"
          />
          <h5 className="page-title mr-8">{companyDetails?.company_name}</h5>
          {companyTier != 'TIER_3' && (
            <button
              onClick={onOpenModal}
              className="background-brand px-4 py-2 text-sm rounded-lg text-white"
            >
              Upgrade to Tier 3
            </button>
          )}
          <Modal open={open} onClose={onCloseModal} center>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 max-w-md">Upgrade to Tier 3</h2>
              <p className="text-gray-700 max-w-md mb-4">
                You are currently using the abridged MFI self-assessment tool (Tier 1 Only) which
                allows you to achieve a maximum of 40% out of a possible 60% total score for the
                self-assessment component of the MFI.
                <br />
                By clicking <b>Confirm</b> below, you are hereby choosing to upgrade to the full MFI
                self-assessment which potentially allows you to achieve the maximum 60% total score.
                This will require you to complete responses (and provide additional evidence) for
                Tiers 2 & 3 of the self-assessment tool.
              </p>
              {!upgrading ? (
                <button
                  onClick={upgrade}
                  className="background-brand px-6 py-4 rounded-lg text-white"
                >
                  Confirm
                </button>
              ) : (
                <button className="bg-gray-200 px-6 py-4 rounded-lg text-gray-500 cursor-not-allowed">
                  Upgrading...
                </button>
              )}
            </div>
          </Modal>
        </div>
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
        <div className="flex-row-middle flex-space-between margin-bottom-10">
          <div>
            <Text className="margin-bottom-1 weight-medium" fontSize="25px" fontWeight="700">
              {selectedCycleObj?new Date(
                selectedCycleObj?.end_date?._seconds * 1000 + selectedCycleObj?.end_date?._nanoseconds / 1000000,
              ).getFullYear():'New '} Cycle
            </Text>
            <div className="text-small text-color-body-text weight-medium">
              {cycle?.name}
            </div>
          </div>
          <div className="flex-row-middle">
            <div className="margin-right-4 text-small text-color-body-text">Showing Product Testing Result for:</div>
            <div className="width-auto margin-bottom-0 w-form" style={{width: '37%'}}>
              <form
                id="email-form"
                name="email-form"
                data-name="Email Form"
                className="flex-row-middle"
              >
                <select
                  id="field-2"
                  name="field-2"
                  data-name="Field 2"
                  className="border-1px rounded-large background-color-4 margin-bottom-0 w-select"
                  onChange={setPT}
                >
                  {
                    companyBrandDetails[0]?.brands?.map((brand) =>
                      <option
                        key={brand.id}
                        value={JSON.stringify(brand)}>
                        {brand.name}
                      </option>
                    )}
                  {/* <option value="Alpha Assessment">Alpha Assessment</option>
                  <option value="Beta Assessment">Beta Assessment</option> */}
                </select>
              </form>
              <div className="w-form-done">
                <div>Thank you! Your submission has been received!</div>
              </div>
              <div className="w-form-fail">
                <div>Oops! Something went wrong while submitting the form.</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Flex flexDirection="row" flexWrap="wrap">
            {scores.map((val) => (
              <Flex
                className="background-color-white border-1px rounded-large padding-5"
                key={nanoid()}
                flexDirection="column"
                width="340px"
                m={3}
              >
                <Text className="margin-bottom-1 weight-medium" fontSize="18px" fontWeight="700">
                  {val.score_type === 'SAT'
                    ? 'Self Assessment Scores'
                    : val.score_type === 'IEG'
                      ? 'Industry Expert Group'
                      : 'Product Testing'}
                </Text>
                <Text className="margin-bottom-2 weight-medium" fontSize="44px" fontWeight="700">
                  {val.value}%
                </Text>
                <div className="text-small margin-bottom-5">
                  <span className="text-color-green">+23.12%</span> From Alpha Assessment
                </div>
                <ProgressChart size={Number(val.value)} range={0} />
                <div className="flex-row-middle margin-top-4">
                  <div className="flex-row-middle">
                    <div className="width-5 height-2 background-color-blue-light rounded-small"></div>
                    <div className="text-xs margin-left-2 text-color-1">Current Assessment</div>
                  </div>
                  <div className="flex-row-middle margin-left-4">
                    <div className="width-5 height-2 background-color-blue radius-small"></div>
                    <div className="text-xs margin-left-2 text-color-1">Previous Assessment</div>
                  </div>
                </div>
              </Flex>
            ))}
          </Flex>
          <Text
            className="margin-bottom-2 weight-medium margin-top-8"
            fontSize="18px"
            fontWeight="700"
          >
            Overview
          </Text>
          <div className="w-layout-grid grid-2-columns right-2---1 margin-top-5">
            <div className="background-color-white border-1px rounded-large padding-5">
              <Text className="margin-bottom-5 weight-medium" fontSize="15px" fontWeight="700">
                Overall Weighted Score
              </Text>
              <div className="width-full flex-justify-center margin-top-10">
                <PieChart width={300} height={300}>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    cx="50%"
                    cy="50%"
                    data={data}
                    innerRadius={110}
                    outerRadius={135}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            </div>
            <div className="background-color-white border-1px rounded-large padding-5">
              <div className="flex-space-between margin-bottom-5">
                <Text className="margin-bottom-5 weight-medium" fontSize="15px" fontWeight="700">
                  Assessment Scores
                </Text>
              </div>
              <div className="width-full flex-justify-start" style={{maxWidth: 650}}>
                <Bar
                  data={{
                    labels: ['SAT', 'IEG', 'IVC', 'PT'],
                    datasets: [
                      {
                        label: 'Scores',
                        data: [satTotalScore, iegTotalScore, ivcTotalScore, productTestingChart],
                        backgroundColor: 'rgba(82, 108, 219, 1)',
                        borderColor: 'rgba(82, 108, 219, 1)',
                        borderWidth: 1,
                        barThickness: 37,
                        minBarLength: 2,
                        barPercentage: 5.0,
                      },
                    ],
                  }}
                  options={options}
                />
              </div>
            </div>
          </div>
          <div className="margin-top-5 background-color-white radius-large padding-5 border-1px">
            <div>
              <Text className="margin-bottom-5 weight-medium" fontSize="15px" fontWeight="700">
                Self Assessment Scores
              </Text>
            </div>
            <Bar
              data={{
                labels: [
                  'Personnel',
                  'Production',
                  'Procurement and Suppliers',
                  'Public Engagement',
                  'Governance',
                ],
                datasets: [
                  {
                    label: 'Validated Scores',
                    data: companyIVCScores,
                    backgroundColor: 'rgba(202, 211, 244, 1)',
                    borderWidth: 1,
                    barThickness: 37,
                    minBarLength: 2,
                    barPercentage: 5.0,
                  },
                  {
                    label: 'Self Assessment Scores',
                    data: companySATScores,
                    backgroundColor: 'rgba(82, 108, 219, 1)',
                    borderColor: 'rgba(82, 108, 219, 1)',
                    borderWidth: 1,
                    barThickness: 37,
                    minBarLength: 2,
                    barPercentage: 5.0,
                  },
                ],
              }}
              options={options}
            />
          </div>
          <div className="margin-top-5 background-color-white radius-large padding-5 border-1px">
            <div>
              <Text className="margin-bottom-5 weight-medium" fontSize="15px" fontWeight="700">
                Industry Expert Group Scores
              </Text>
            </div>

            <Bar
              data={{
                labels: [
                  'Personnel',
                  'Production',
                  'Procurement and Suppliers',
                  'Public Engagement',
                  'Governance',
                ],
                datasets: [
                  {
                    label: 'Industry Expert Group Scores',
                    data: companyIEGScores,
                    backgroundColor: 'rgba(82, 108, 219, 1)',
                    borderColor: 'rgba(82, 108, 219, 1)',
                    borderWidth: 1,
                    barThickness: 37,
                    minBarLength: 2,
                    barPercentage: 5.0,
                  },
                ],
              }}
              options={options}
            />
          </div>
          <div className="margin-top-5 background-color-white radius-large padding-5 border-1px">
            <div className="flex-space-between">
              <div>
                <Text className="margin-bottom-5 weight-medium" fontSize="15px" fontWeight="700">
                  {/* {companyBrands[0]} ({productDuplicates === true ? productType[0][0] : productType[0]}) */}
                  Product Testing
                </Text>
                <div className="text-small text-color-body-text margin-top-2">
                  Company scores are compared with the average industry score
                </div>
              </div>
              <div className="width-auto w-form">
                <form
                  id="email-form"
                  name="email-form"
                  data-name="Email Form"
                  className="flex-row-middle"
                >
                  {/* <select
                    id="field-2"
                    name="field-2"
                    onChange={(e) => setTesting(e.target.value)}
                    data-name="Field 2"
                    className="border-1px rounded-large background-color-white w-select"
                  >
                    <option value="Flour">Flour</option>
                    <option value="Edible Oil">Edible Oil</option>
                    <option value="Sugar">Sugar</option>
                  </select> */}
                </form>
                <div className="w-form-done">
                  <div>Thank you! Your submission has been received!</div>
                </div>
                <div className="w-form-fail">
                  <div>Oops! Something went wrong while submitting the form.</div>
                </div>
              </div>
            </div>
            <AssessmentChart1 productTestData={productTestData} />
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
