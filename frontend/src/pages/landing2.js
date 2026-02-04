import React, {useRef, useState, useEffect} from 'react';
import ReactToPrint from 'react-to-print';
import {Link} from 'react-router-dom';
import logo from 'assets/images/I-Logo-Placeholder-white.svg';
// import PieChart from './admin/dashboard/component/pie-chart';
import PublicPieChart from '../pages/public-pie';
// import Performance from './admin/dashboard/component/performance';
import {Text, Flex} from '@chakra-ui/react';
import 'styles/normalize.css';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';
// import lorem from 'assets/images/lorem.png';
// import devon from 'assets/images/devons-kings.png';
// import notes from 'assets/images/notes.png';
// import {useHistory} from 'react-router-dom';

// import {IoChevronForward} from 'react-icons/io5';
import dangote from 'assets/images/dangote-sugar.png';
// import Honeywell from 'assets/company_images/honeywell.png';
import pzwilmar from 'assets/company_images/PZMiller.png';
import crown from 'assets/company_images/crownflour.jpg';
import flourMills from 'assets/company_images/flourmills.jpg';
import raffles from 'assets/company_images/raffles.png';
// import raffles from 'assets/company_images/dufil.png';
// import crownFlour from 'assets/company_images/crownflour.jpg';
// import pzWilmar from 'assets/company_images/wilmar.jpg';
import grandCereal from 'assets/company_images/grand.png';
import premiumEdibleOil from 'assets/company_images/premiumOil.png';
import dufil from 'assets/company_images/dufilPrima.jpg';
// import kingsFlour from 'assets/company_images/kings.png';
import sunolaOil from 'assets/company_images/sunola.jpg';
import applePears from 'assets/company_images/appleandpears.jpg';
// import bua from 'assets/company_images/bua.png';
import golden from 'assets/company_images/golden.png';
import lifeflour from 'assets/images/lifeflour.png';
import buafoods from 'assets/images/buafoods.png';
import boram from 'assets/images/boram.png';
import {request} from 'common';
// import Loader from 'components/circular-loader';
// import {Spinner} from '@chakra-ui/react';
// import ProgressChart from './admin/dashboard/component/progress-chart';
import wasil from 'assets/images/wasil-png.png';

const Page = () => {
  const [brandList, setBrandList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  console.log('spinning', spinning);
  // const [brandRank, setRanking] = useState();
  const [mfiScore, setMfiScore] = useState([]);
  console.log('mfiScore', mfiScore);
  const [filteredData, setFilteredData] = useState();
  // const history = useHistory();

  const componentRef = useRef();

  useEffect(() => {
    setMfiScore(localStorage.getItem('mfi') ? JSON.parse(localStorage.getItem('mfi')) || null : 78);
  }, []);

  const getCompanies = async () => {
    try {
      setSpinning(true);
      const {
        data: {data: res},
      } = await request().get(`/ranking-list?page-size=50`);
      const filteredResponse = res.filter((x) => x.id !== 'akpQPiE0sFH2iwciggHd');

      setFilteredData(filteredResponse);
      const brands = filteredResponse.map((x) => x.brands.map((x) => x.name).length);
      setBrandList((brands.reduce((accum, item) => accum + item, 0)));

      setSpinning(false);
    } catch (error) {
      console.log({error});
    }
  };

  console.log('brandList', brandList);
  console.log('filteredData', filteredData);

  useEffect(() => {
    getCompanies();
  }, []);


  // Updated: Each company may have multiple brands under "brands" array
  const ranks = [
    {
      brands: ['Golden Penny Prime Flour', 'Golden Penny Confectionary Flour', 'Classic All Purpose', 'Superfine wheat flour'],
      company: 'Flour Mills of Nigeria Plc',
      overallScore: 93.00,
      logo: flourMills
    },
    {
      brands: ['Mamador Pure Vegetable Oil'],
      company: 'PZ Wilmar',
      overallScore: 92.60,
      logo: pzwilmar
    },
    {
      brands: ['Power Oil', 'Emperor Vegetable Oil'],
      company: 'Raffles Oil LFTZ Enterprises',
      overallScore: 93.00,
      logo: raffles
    },
    {
      brands: ['Mama Gold Flour', 'Dangote Bread Flour', 'Bakewell Flour'],
      company: 'Crown Flour Mills LTD (OLAM)',
      overallScore: 89.80,
      logo: crown
    },
    {
      brands: ['Golden Terra'],
      company: 'WASIL Ltd',
      overallScore: 89.00,
      logo: wasil
    },
    {
      brands: ['Dangote Sugar'],
      company: 'Dangote Sugar Refinery Plc',
      overallScore: 86.00,
      logo: dangote
    },
    {
      brands: ['Mix & Bake Flour'],
      company: 'Crown Flour Mills LTD (OLAM)',
      overallScore: 81.80,
      logo: crown
    },
    {
      brands: ['Sunola Soya Oil'],
      company: 'Sunola Foods Ltd',
      overallScore: 78.20,
      logo: sunolaOil
    },
    {
      brands: ['Maikwabo'],
      company: 'Flour Mills of Nigeria Plc',
      overallScore: 76.00,
      logo: flourMills
    },
    {
      brands: ['Golden Penny Sugar'],
      company: 'Golden Sugar Company Ltd',
      overallScore: 75.20,
      logo: golden
    },
    {
      brands: ['Laziz Pure Vegetable Oil', 'Active Premium Vegetable Oil'],
      company: 'Apple and Pears LTD',
      overallScore: 73.20,
      logo: applePears
    },
    {
      brands: ['Happy Bake Flour', 'Royal Bake Wheat Flour', 'Diamond D\'Lite'],
      company: 'Dufil Prima Foods PLC',
      overallScore: 72.80,
      logo: dufil
    },
    {
      brands: ['Winner Pure Soya Oil'],
      company: 'Apple and Pears LTD',
      overallScore: 63.20,
      logo: applePears
    },
    {
      brands: ['Sunola Sugar'],
      company: 'Sunola Foods Ltd',
      overallScore: 58.20,
      logo: sunolaOil
    },
    {
      brands: ['Life wheat flour'],
      company: 'Life Flour Mills Ltd',
      overallScore: 49.80,
      logo: lifeflour
    },
    {
      brands: ['BUA Premium Refined Sugar'],
      company: 'BUA Sugar Refinery Ltd',
      overallScore: 36.00,
      logo: buafoods
    },
    {
      brands: ['Grand Pure Soya Oil'],
      company: 'Grand Cereals Ltd',
      overallScore: 35.80,
      logo: grandCereal
    },
    {
      brands: ['Golden Penny Pure Soya Oil', 'Golden Penny Pure Vegetable Oil'],
      company: 'Premium Edible Oils LTD',
      overallScore: 35.20,
      logo: premiumEdibleOil
    },
    {
      brands: ['Activa Pure Vegetable Oil'],
      company: 'Golden Oil Industries Ltd',
      overallScore: 35.20,
      logo: golden
    },
    {
      brands: ['BOW Soya Pure Oil'],
      company: 'BORAM Foods Ltd',
      overallScore: 27.00,
      logo: boram
    },
  ];
  // const result = topBrands.reduce(function (r, a) {
  //   r[a.companyName] = r[a.companyName] || [];
  //   r[a.companyName].push(a);
  //   return r;
  // }, Object.create(null));

  // console.log('topBrands', topBrands);
  //   var topValues = [...result].sort((a,b) => b-a).slice(0,5);
  // // [...values] will create shallow copy
  // console.log(topValues);


  // const buttonRouter = () => {
  //   history.push('/');
  // };

  return (
    <div>
      <div className="background-image">
        <div
          data-collapse="medium"
          data-animation="default"
          data-duration="400"
          role="banner"
          className="padding-x-10 background-color-transparent border-bottom-1px-white w-nav"
        >
          <div className="flex-row-middle max-width-full w-container">
            <div className="width-full flex-row-middle flex-space-between padding-y-5">
              <a href="/" className="w-nav-brand">
                <img src={logo} loading="lazy" alt="" style={{objectFit: 'contain'}} />
              </a>
              <nav role="navigation" className="flex-row-middle w-nav-menu">
                <Link
                  to="/login"
                  className="transparent-button-white secondary margin-right-4 w-button"
                >
                  Login
                </Link>{' '}
                <Link to="/sign-up" className="transparent-button-white w-button">
                  Sign Up
                </Link>
              </nav>
            </div>
            <div className="w-nav-button">
              <div className="w-icon-nav-menu"></div>
            </div>
          </div>
        </div>
        <div className="padding-y-16 flex-row-centered">
          <div className="width-10-12 flex-column-centered">
            <Text
              className="text-color-4 text-align-center margin-bottom-6"
              fontSize="50px"
              fontWeight="700"
            >
              Micronutrient <br />
              Fortification Index
            </Text>
            {/* <a href={PieChart} className="button-secondary on-image w-button" download>
                Download now
              </a> */}
            {/* <ReactToPrint
                trigger={() => <button href={PieChart} className="button-secondary on-image w-button" download>
                  Download now
                </button>}
                content={() => componentRef.current}
              /> */}
            <ReactToPrint
              trigger={() => {
                return <button className="button-secondary on-image w-button">
                  Download now
                </button>;
              }}
              content={() => componentRef.current}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="padding-y-10 container-1280 padding-x-10" ref={componentRef}>
          <div className="px-5">
            <Flex flexWrap="wrap">
              <Flex flexDirection="column" mr={['none', '25px']}>
                <div
                  className="background-color-white border-1px rounded-large padding-5 box-shadow-large"
                  style={{width: 330, marginBottom: 10}}
                >
                  <Text
                    className="margin-bottom-1 weight-medium"
                    fontSize="18px"
                    fontWeight="700"
                  >
                    Total Brands
                  </Text>
                  <Text
                    className="margin-bottom-2 weight-medium"
                    fontSize="44px"
                    fontWeight="700"
                  >
                    32

                  </Text>
                  {/*
                    <div className="text-small margin-bottom-5">
                      <span className="text-color-green">+23.12%</span> From Alpha Assessment
                    </div>
                    <ProgressChart size={Number(80)} range={74} />
                    <div className="flex-row-middle margin-top-4">
                      <div className="flex-row-middle">
                        <div className="width-5 height-2 background-color-blue-light rounded-small"></div>
                        <div className="text-xs margin-left-2 text-color-1">Current Assessment</div>
                      </div>
                      <div className="flex-row-middle margin-left-4">
                        <div className="width-5 height-2 background-color-blue radius-small"></div>
                        <div className="text-xs margin-left-2 text-color-1">June Assessment</div>
                      </div>
                    </div>
                    */}
                </div>
                <div
                  className="background-color-white border-1px rounded-large padding-5 box-shadow-large"
                  style={{width: 330, marginBottom: 10}}
                >
                  <Text
                    className="margin-bottom-5 weight-medium"
                    fontSize="18px"
                    fontWeight="700"
                  >
                    Brands By Food Vehicle Breakdown
                  </Text>
                  <div className="flex-row-middle">
                    <PublicPieChart
                      bg={[
                        '#526CDB',
                        'rgba(82, 108, 219, 0.75)',
                        'rgba(82, 108, 219, 0.5)',
                        'rgba(79, 104, 212, 0.25)',
                      ]}
                    />
                  </div>
                </div>
                <div
                  className="background-color-white border-1px rounded-large padding-5 box-shadow-large"
                  style={{width: 330, marginBottom: 10}}
                >
                  <Text
                    className="margin-bottom-2 weight-medium"
                    fontSize="18px"
                    fontWeight="700"
                  >
                    Average Score for{' '}
                    <span className="text-color-body-text underline">all industries</span>
                  </Text>
                  <Text
                    className="margin-bottom-2 weight-medium"
                    fontSize="44px"
                    fontWeight="700"
                  >
                    72.9%
                  </Text>

                  {/*
                    <div className="text-small margin-bottom-5">
                      <span className="text-color-green">+23.12%</span> From Alpha Assessment
                    </div>
                    <ProgressChart size={Number(80)} range={74} />
                    <div className="flex-row-middle margin-top-4">
                      <div className="flex-row-middle">
                        <div className="width-5 height-2 background-color-blue-light rounded-small"></div>
                        <div className="text-xs margin-left-2 text-color-1">Current Assessment</div>
                      </div>
                      <div className="flex-row-middle margin-left-4">
                        <div className="width-5 height-2 background-color-blue radius-small"></div>
                        <div className="text-xs margin-left-2 text-color-1">June Assessment</div>
                      </div>
                    </div>
                    */}
                </div>
              </Flex>
              <div className="width-1-0 padding-left-1" style={{flex: 1}}>
                <div className="border-1px rounded-large box-shadow-large background-color-white flex-column-centered">
                  <div className="flex-row-middle flex-space-between padding-5 width-full">
                    <h6 className="margin-bottom-0 weight-medium">All Brand Rankings</h6>
                    <div className="flex-row-middle margin-left-4">
                      <div
                        className="width-5 height-2 radius-small"
                        style={{background: '#00b37a'}}
                      ></div>
                      <div className="text-xs margin-left-2 text-color-body-text">
                        Overall MFI Score
                      </div>
                    </div>
                  </div>


                  {ranks.map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="flex-row-middle flex-space-between padding-2 width-full">
                        <div className="flex-row margin-right-4 flex-row-middle">
                          <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>{index + 1}</h5>
                          <img
                            src={item.logo}
                            loading="lazy"
                            alt=""
                            className="margin-right-4 w-12 h-12 rounded-full"
                            style={{objectFit: 'contain'}}
                          />
                          <Flex flexDirection="column">
                            <div className="text-small weight-high" style={{fontWeight: 'bold'}}>
                              {item.company}
                            </div>
                          </Flex>
                        </div>
                      </div>

                      <div
                        className="flex-row-middle flex-space-between padding-2 width-full"
                        style={{paddingLeft: '102px', paddingRight: '26px'}}
                      >
                        <Flex flexDirection="column">
                          {item.brands.map((brandName, brandIndex) => (
                            <div key={brandIndex} className="text-small weight-medium">
                              {brandName}
                            </div>
                          ))}
                        </Flex>
                        <div className="height-2 rounded-full background-hover width-6-12">
                          <div
                            className="height-2 rounded-full width-2-3"
                            style={{background: '#00b37a', width: `${item.overallScore}%`}}
                          ></div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}


                </div>
              </div>
            </Flex>
          </div>

          {/* <div className="container-1280 margin-bottom-10 wf-section">
            <Performance name={'MFI Brands - Performance by Fortified Staple Food Vehicle'} />
          </div> */}
          <div className="container-1280 margin-bottom-10 wf-section">
            <div className="footer-cta-background">
              <div className="width-1-2 flex-column-centered portrait-width-full tablet-width-9-12">
                <Text className="text-align-center text-color-4 margin-bottom-10 boldTexts">
                  Register your company and be part of the solution to ensuring improved health
                  and nutrition through industry leadership
                </Text>
                <Link to="/sign-up" className="button w-button">
                  Register Your Company
                </Link>
              </div>
            </div>
          </div>
          <div className="border-top-1px margin-top-10 padding-top-5 flex-space-between">
            <div className="text-xs text-color-body-text">
              © Copyright MFI. All rights reserved
            </div>
            <div className="text-xs text-color-body-text">Powered by <a href=" https://www.technoserve.org/" target="_blank">TechnoServe</a></div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Page;
