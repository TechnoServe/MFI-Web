/* eslint-disable react/prop-types */
import React, {useState, useEffect, useRef} from 'react';
import {Bar} from 'react-chartjs-2';
import ReactToPrint from 'react-to-print';
import {PieChart, Pie, Cell, Sector} from 'recharts';
import {Flex, Text, useToast, Spinner} from '@chakra-ui/react';
import AssessmentChart1 from './component/assessment-chart-1';
import ProgressChart from './component/progress-chart';
import {useSelector} from 'react-redux';
import {request} from 'common';
import {nanoid} from '@reduxjs/toolkit';

import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import propTypes from 'prop-types';


/**
 * CompanyDashboard component renders a detailed dashboard for a selected company and cycle.
 * It includes scores from SAT, IEG, IVC, and Product Testing along with comparative charts.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.cycle - The current cycle object used to fetch and display data.
 * @returns {JSX.Element} The rendered company dashboard UI.
 */
const CompanyDashboard = ({cycle}) => {
  const company = JSON.parse(localStorage.getItem('company'));
  const companyList = JSON.parse(localStorage.getItem('company-list'));
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
  const [satIVCIndustryAverageList, setSATIVCIndustryAverageList] = useState([]);

  const [iegData, setIEGData] = useState([]);
  const [companyIEGScores, setCompanyIEGScores] = useState([]);
  const [iegTotalScore, setIEGTotalScore] = useState(0);

  const [ptData, setPTData] = useState([]);
  const [ptTotalScore, setPTTotalScore] = useState(0);

  const [productTestData, setProductTestData] = useState([]);

  const [overallWeightedScore, setOverallWeightedScore] = useState(0);
  const [companyBrandDetails, setCompanyBrandDetails] = useState([]);
  const [productTestingChart, setProductTestingChart] = useState();


  const [brandDropDown, setBrand] = useState();


  const user = useSelector((state) => state.auth.user);
  const componentRef = useRef();

  const [activeIndex] = useState(0);


  // Compute industry average scores for SAT/IVC categories based on company list
  const getSATIVCIndustryAverage = () => {
    const satIVCIndustryAverage = [];
    const SATCategories = [{name: 'Personnel', score: 0, pointer: 1}, {name: 'Production', score: 0, pointer: 2}, {name: 'Procurement & Suppliers', score: 0, pointer: 3}, {name: 'Public Engagement', score: 0, pointer: 4}, {name: 'Governance', score: 0, pointer: 5}];
    let totalCompanies = 0;
    companyList.forEach((company) => {
      if (company.ivcScores?.length > 0) {
        totalCompanies++;
        SATCategories.forEach((category) => {
          const IVCCategoryScore = company.ivcScores?.find((x) => x.name === category.name);
          if (IVCCategoryScore) {
            switch (IVCCategoryScore.pointer) {
              case 1:
                category.score += (IVCCategoryScore.score?.toFixed() / 23) * 100;
                break;
              case 2:
                category.score += (IVCCategoryScore.score?.toFixed() / 20) * 100;
                break;
              case 3:
                category.score += (IVCCategoryScore.score?.toFixed() / 15) * 100;
                break;
              case 4:
                category.score += (IVCCategoryScore.score?.toFixed() / 17) * 100;
                break;
              case 5:
                category.score += (IVCCategoryScore.score?.toFixed() / 25) * 100;
                break;
            }
          }
        });
      }
    });
    SATCategories.forEach((category) => {
      category.score = category.score / totalCompanies;
      satIVCIndustryAverage.push(category.score);
    });
    setSATIVCIndustryAverageList(satIVCIndustryAverage);
  };


  // Fetches the company details for the given company and cycle from the backend
  const getCompanyDetails = async () => {
    try {
      const {data: res} = await request(true).get(
        `/company/details/?company-id=${company.id}&cycle-id=${cycle.id}`
      );
      setCompanyTier(res.company.tier);
      setCompanyDetails(res.company);
    } catch (error) {
    }
  };

  // Fetches the upgrade action for the given company and cycle from the backend
  const upgrade = async () => {
    setUpgrading(true);
    try {
      await request(true).post(`/company/set-tier`, {
        'tier': 'TIER_3',
        'company-id': company.id,
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
    }
  };

  // Fetches the test scores for the given company and cycle from the backend
  const getTestScores = async () => {
    try {
      const {
        data: {data: res},
      } = await request(true).get(`/sat/scores?company-id=${company.id}&cycle-id=${cycle.id}`);
      setScores(res.sort((a, b) => a.sort_order - b.sort_order));
      setLoading(false);
      setGetSATScore(res);
    } catch (error) {
      setLoading(false);
    }
  };

  // Fetches the SAT scores for the given company and cycle from the backend
  const getSATScores = async () => {
    try {
      const {
        data: {data: res},
      } = await request(true).get(`/ranking-list?page-size=50&cycle-id=${cycle.id}`);

      setSATData(res);
      setIVCData(res);
    } catch (error) {
      setLoading(false);
    }
  };

  // Fetches the IEG scores for the given company and cycle from the backend
  const getIEGScores = async () => {
    try {
      const {
        data: {data: res},
      } = await request(true).get(
        `/company/ieg?cycle-id=${cycle.id}&company-id=${company.id}`
      );

      setIEGData(res);
    } catch (error) {
      setLoading(false);
    }
  };

  // Fetches the IVC scores for the given company and cycle from the backend
  const getIVCScores = async () => {
    try {
      await request(true).get(
        `/company/ivc?cycle-id=${cycle.id}&company-id=${company.id}`
      );
    } catch (error) {
      setLoading(false);
    }
  };

  // Fetches the PT scores for the given company and cycle from the backend
  const getPTScores = async () => {
    try {
      const {
        data: {data: res},
      } = await request(true).get(`companies/${company.id}/products-tests?cycle-id=${cycle.id}`);
      setPTData(res);
    } catch (error) {
      setLoading(false);
    }
  };

  // Fetch company details and assessment data when component mounts
  useEffect(() => {
    company && getSATIVCIndustryAverage();
    company && getIVCScores();
    company && getIEGScores();
    company && getTestScores();
    company && getSATScores();
    company && getPTScores();
    company && getCompanyDetails();
  }, [user]);

  // Parse and compute various score breakdowns after SAT, IEG, IVC, PT, and other data is set
  useEffect(() => {
    const filteredCompanyBrand =
      satData.length > 0
        ? satData.filter((item) => {
          return item.id === company.id;
        })
        : [];

    setCompanyBrandDetails(filteredCompanyBrand);
    setBrand(filteredCompanyBrand[0]?.brands[0]?.id);
    setProductTestingChart(filteredCompanyBrand[0]?.brands[0]?.productTests[0]?.fortification?.score);
    const satScoresArr = [];
    const satTotalScoreArr = [];
    if (filteredCompanyBrand.length > 0 && filteredCompanyBrand[0].satScores.length > 0) {
      filteredCompanyBrand[0].satScores.forEach((categoryObj) => {
        switch (categoryObj?.pointer) {
          case 1:
            satScoresArr[0] = (categoryObj.score / 23) * 100;
            satTotalScoreArr[0] = categoryObj.score;
            break;
          case 2:
            satScoresArr[1] = (categoryObj.score / 20) * 100;
            satTotalScoreArr[1] = categoryObj.score;
            break;
          case 3:
            satScoresArr[2] = (categoryObj.score / 15) * 100;
            satTotalScoreArr[2] = categoryObj.score;
            break;
          case 4:
            satScoresArr[3] = (categoryObj.score / 17) * 100;
            satTotalScoreArr[3] = categoryObj.score;
            break;
          case 5:
            satScoresArr[4] = (categoryObj.score / 25) * 100;
            satTotalScoreArr[4] = (categoryObj.score);
            break;
        }
      });
    }

    if (satTotalScoreArr.length > 0) {
      setSATTotalScore(satTotalScoreArr.reduce((prevIter, item) => prevIter + item));
    }

    // Product Test
    if (filteredCompanyBrand.length > 0 && filteredCompanyBrand[0].brands.length > 0) {
      setProductTestData(filteredCompanyBrand[0]?.brands[0]?.productTests);
      setPTTotalScore(filteredCompanyBrand[0]?.brands[0]?.productTests[0]?.fortification.score);
    }

    const iegScoresArr = [];
    const iegTotalScoreArr = [];
    if (iegData?.length > 0) {
      iegData?.forEach((item) => {
        switch (item.category.pointer) {
          case 1:
            iegScoresArr[0] = (item.score?.toFixed() / 23) * 100;
            iegTotalScoreArr[0] = parseInt(item.score);
            break;
          case 2:
            iegScoresArr[1] = (item.score?.toFixed() / 20) * 100;
            iegTotalScoreArr[1] = parseInt(item.score);
            break;
          case 3:
            iegScoresArr[2] = (item.score?.toFixed() / 15) * 100;
            iegTotalScoreArr[2] = parseInt(item.score);
            break;
          case 4:
            iegScoresArr[3] = (item.score?.toFixed() / 17) * 100;
            iegTotalScoreArr[3] = parseInt(item.score);
            break;
          case 5:
            iegScoresArr[4] = (item.score?.toFixed() / 25) * 100;
            iegTotalScoreArr[4] = parseInt(item.score);
            break;
        }
      });
    }


    if (iegTotalScoreArr.length > 0) {
      setIEGTotalScore(iegTotalScoreArr.reduce((prevIter, item) => prevIter + item));
    }


    const newIVCData = companyBrandDetails[0]?.ivcScores;
    const ivcScoresArr = [];
    const ivcTotalScoreArr = [];
    if (newIVCData?.length > 0) {
      newIVCData?.forEach((item) => {
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


    if (ivcTotalScoreArr.length > 0) {
      let totalScore = ivcTotalScoreArr.reduce((prevIter, item) => prevIter + item);
      if (companyBrandDetails[0]?.tier == 'TIER_1') {
        totalScore = totalScore / 100 * 60;
      }
      setIVCTotalScore(totalScore);
    }

    setCompanySATScores(satScoresArr);
    setCompanyIEGScores(iegScoresArr);
    setCompanyIVCScores(ivcScoresArr);

    const loadData = async () => {
      const satValue = (await typeof ivcTotalScore) !== 'undefined' ? ivcTotalScore : satTotalScore;
      const ptWeightedScore = (await ptTotalScore);
      const iegWeightedScore = ((await iegTotalScore) / 100) * 20;
      const satWeightedScore = ((await satValue) / 100) * 60;
      setOverallWeightedScore(ptWeightedScore + iegWeightedScore + satWeightedScore);
    };
    loadData();
    // Compliance Score
  }, [satData, iegData, ivcData, ptData, overallWeightedScore]);


  // Handler for dropdown to set selected brand's product testing data
  const setPT = (e) => {
    setProductTestingChart(JSON.parse(e.target.value)?.productTests[0]?.fortification?.score);

    setProductTestData(JSON.parse(e.target.value)?.productTests);
    setPTTotalScore(JSON.parse(e.target.value)?.productTests[0]?.fortification.score);

    setBrand(JSON.parse(e.target.value)?.id);
  };


  // Brands SAT Charts
  const selfAssessmentBrand = companyBrandDetails?.filter((brand) => brand.brands.find((x) => x.id === brandDropDown));

  // Tier One Breakdown
  const tierOneSABrand = selfAssessmentBrand?.filter((x) => x?.tier.includes('TIER_1'));
  const tierOneSatBrand = tierOneSABrand?.filter((x) => x?.tier.includes('TIER_1'))?.map((x) =>
    (x.ivcScores?.map((x) => x.score)?.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0) || 0)
  );
  const percentageTierOneSatBrand = tierOneSatBrand?.map((x) => x / 100 * 60);

  const tierOneSatBrandTotal = percentageTierOneSatBrand?.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);

  // Tier Three Breakdown
  const tierThreeSABrand = selfAssessmentBrand?.filter((x) => x?.tier.includes('TIER_3'));
  const tierThreeSatBrandCul = tierThreeSABrand?.filter((x) => x?.tier.includes('TIER_3'))?.map((x) => {
    const scores = x.ivcScores?.map((x) => x.score) || [];
    return scores.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0);
  });

  const tierThreeSatBrandTotal = tierThreeSatBrandCul?.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);

  let SABrandsTierOne = 0;
  let SABrandsTierThree = 0;
  if ((selfAssessmentBrand?.map((x) => x.tier === 'TIER_1'))) {
    SABrandsTierOne = tierOneSatBrandTotal?.toFixed();
  }
  if ((selfAssessmentBrand?.map((x) => x.tier === 'TIER_3'))) {
    SABrandsTierThree = tierThreeSatBrandTotal?.toFixed();
  }

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
  const ptWeightedScoreBrand = parseInt(PTTesting);
  const iegWeightedScoreBrand = ( iegTotalScore / 100) * 20;
  const satWeightedScoreBrand = (satValueBrand / 100) * 60;


  const MFIBrandTotalBrand = ptWeightedScoreBrand + iegWeightedScoreBrand + satWeightedScoreBrand;

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

  // Custom renderer for PieChart active slice to show a large percentage value
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
        <ReactToPrint
          trigger={() => (
            <button className="flex-row-middle padding-x-4 padding-y-2 background-brand rounded-large text-color-4 no-underline w-inline-block">
              <div className="padding-right-2 text-small text-color-4">Download</div>
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
      <div className="padding-10" ref={componentRef}>
        <div className="flex-row-middle flex-space-between margin-bottom-10">
          <div>
            <Text className="margin-bottom-1 weight-medium" fontSize="25px" fontWeight="700">
              {cycle?new Date(
                cycle?.end_date._seconds * 1000 + cycle?.end_date._nanoseconds / 1000000,
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
                  {Number(val.value).toFixed(2)}%
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
              {/* Render PieChart showing overall weighted MFI score */}
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
                MFI Scores (Unweighted) - By Component
                </Text>
              </div>
              {/* Render BarChart for MFI component scores */}
              <div className="width-full flex-justify-start" style={{maxWidth: 650}}>
                <Bar
                  data={{
                    labels: ['SAT(U)', 'SAT(V)', 'Product Testing', 'Industry Intelligence'],
                    datasets: [
                      {
                        label: 'Scores',
                        data: [satTotalScore, ivcTotalScore, productTestingChart, iegTotalScore],
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
            {/* Render stacked BarChart for Self Assessment Scores (SAT/IVC) */}
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
                  {
                    label: 'Industry Average Scores',
                    data: satIVCIndustryAverageList,
                    backgroundColor: 'rgb(219, 82, 82)',
                    borderColor: 'rgb(219, 82, 82)',
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

            {/* Render BarChart for Industry Expert Group Scores (IEG) */}
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
                </form>
                <div className="w-form-done">
                  <div>Thank you! Your submission has been received!</div>
                </div>
                <div className="w-form-fail">
                  <div>Oops! Something went wrong while submitting the form.</div>
                </div>
              </div>
            </div>
            {/* Render component-level Product Testing results */}
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

CompanyDashboard.propTypes = {
  cycle: propTypes.any
};

export default CompanyDashboard;
