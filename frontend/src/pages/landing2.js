import React, {useRef, useState, useEffect} from 'react';
import ReactToPrint from 'react-to-print';
import {Link} from 'react-router-dom';
import logo from 'assets/images/I-Logo-Placeholder-white.svg';
// import PieChart from './admin/dashboard/component/pie-chart';
import PublicPieChart from '../pages/public-pie';
import Performance from './admin/dashboard/component/performance';
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

import {request} from 'common';
// import Loader from 'components/circular-loader';
import {Spinner} from '@chakra-ui/react';
import MFICOY from '../Dummie/mfiScoreSheet';
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


  const ranks = MFICOY.sort(function (a, b) {
    return b.overallScore - a.overallScore;
  });

  ranks.forEach(function (player, i, arr) {
    player.rank = i === 0 || player.overallScore != arr[i - 1].overallScore
      ? i + 1
      : arr[i - 1].rank;
  });


  const topBrands = [...ranks].sort((a, b) => b - a).slice(0, 14);
  // const result = topBrands.reduce(function (r, a) {
  //   r[a.companyName] = r[a.companyName] || [];
  //   r[a.companyName].push(a);
  //   return r;
  // }, Object.create(null));

  console.log('topBrands', topBrands);
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
                return <button className="button-secondary on-image w-button" download>
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
                    {(spinning && <Spinner />) || brandList}

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
                    75.3%
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


                  <>
                    {/* one */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>1</h5>
                        <img
                          src={crown}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                    Crown Flour Mills LTD (OLAM)
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                    Mama Gold
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `95.8%`}}
                        ></div>
                      </div>
                    </div>

                    {/* two */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>2</h5>
                        <img
                          src={flourMills}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                    Flour Mills of Nigeria Plc
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                  Golden Penny Confectionary Flour
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `95%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                  Eagle Wheat Flour
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `95%`}}
                        ></div>
                      </div>
                    </div>

                    {/* three */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>3</h5>
                        <img
                          src={raffles}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                    Raffles Oil LFTZ Enterprises
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                    Power Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `94.8%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                  Emperor Vegetable Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `94.8%`}}
                        ></div>
                      </div>
                    </div>

                    {/* four */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>4</h5>
                        <img
                          src={dangote}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                    Dangote Sugar Refinery Plc
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                  Dangote Sugar
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `93%`}}
                        ></div>
                      </div>
                    </div>

                    {/* five */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>5</h5>
                        <img
                          src={crown}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                    Crown Flour Mills LTD (OLAM)
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                  Mix & Bake Flour
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `89.8%`}}
                        ></div>
                      </div>
                    </div>

                    {/* six */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>6</h5>
                        <img
                          src={pzwilmar}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          PZ Wilmar
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Mamador Pure Vegetable Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `89.2%`}}
                        ></div>
                      </div>
                    </div>

                    {/* seven */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>7</h5>
                        <img
                          src={flourMills}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          Flour Mills of Nigeria PLC
                          </div>
                        </Flex>
                      </div>
                    </div>
                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Classic All Purpose
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `89%`}}
                        ></div>
                      </div>
                    </div>

                    {/* eight */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>8</h5>
                        <img
                          src={crown}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          Crown Flour Mills LTD (OLAM)
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Dangote Bread Flour
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `85.6%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        All Purpose Flour
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `85.6%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Bakewell Flour
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `85.6%`}}
                        ></div>
                      </div>
                    </div>

                    {/* nine */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>9</h5>
                        <img
                          src={dufil}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                    Dufil Prima Foods PLC
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Diamond D`&apos;Lite
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `84.6%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Happy Bake Flour
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `84.6%`}}
                        ></div>
                      </div>
                    </div>

                    {/* ten */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>10</h5>
                        <img
                          src={premiumEdibleOil}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          Premium Edible Oils LTD
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Golden Penny Pure Soya Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `82.2%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Golden Penny Pure Vegetable Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `82.2%`}}
                        ></div>
                      </div>
                    </div>

                    {/* eleven */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>11</h5>
                        <img
                          src={dufil}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          Dufil Prima Foods PLC
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Royal Bake Wheat Flour
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `81.6%`}}
                        ></div>
                      </div>
                    </div>

                    {/* twelve */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>12</h5>
                        <img
                          src={applePears}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          Apple and Pears LTD
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Laziz Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `79.2%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Winner Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `79.2%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Active Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `79.2%`}}
                        ></div>
                      </div>
                    </div>

                    {/* thirteen */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>13</h5>
                        <img
                          src={pzwilmar}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          PZ Wilmar
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Devon King&apos;s Pure Vegetable Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `79.2%`}}
                        ></div>
                      </div>
                    </div>
                    {/* 14 */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>14</h5>
                        <img
                          src={wasil}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          WASIL LTD
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Golden Terra
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `79.2%`}}
                        ></div>
                      </div>
                    </div>
                    {/* 14 */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>15</h5>
                        <img
                          src={golden}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          Golden Sugar Company Ltd
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Golden Penny Sugar
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `78.4%`}}
                        ></div>
                      </div>
                    </div>

                    {/* 15 */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>16</h5>
                        <img
                          src={golden}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          Golden Oil Industries LTD
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Activa Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `76.4%`}}
                        ></div>
                      </div>
                    </div>


                    {/* 16 */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>17</h5>
                        <img
                          src={sunolaOil}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          Sunola Foods LTD
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Sunola Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `75.6%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Sunola Sugar
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `75.6%`}}
                        ></div>
                      </div>
                    </div>

                    {/* 17 */}
                    <div className="flex-row-middle flex-space-between padding-2  width-full">
                      <div className="flex-row margin-right-4 flex-row-middle">
                        <h5 style={{paddingRight: '16px', fontWeight: 'bold'}}>18</h5>
                        <img
                          src={grandCereal}
                          loading="lazy"
                          alt=""
                          className="margin-right-4 w-12 h-12 rounded-full"
                          style={{objectFit: 'contain'}}
                        />
                        <Flex
                          flexDirection="column"
                        >
                          <div className="text-small weight-high" style={{fontWeight: 'bold'}} >
                          Grand Cereals Ltd
                          </div>
                        </Flex>
                      </div>
                    </div>

                    <div className="flex-row-middle flex-space-between padding-2  width-full" style={{paddingLeft: '102px', paddingRight: '26px'}}>
                      <Flex
                        flexDirection="column"
                      >
                        <div className="text-small weight-medium">
                        Grand Pure Soya Oil
                        </div>
                      </Flex>
                      <div className="height-2 rounded-full background-hover width-6-12">
                        <div
                          className="height-2 rounded-full width-2-3"
                          style={{background: '#00b37a', width: `75.2%`}}
                        ></div>
                      </div>
                    </div>


                  </>


                </div>
              </div>
            </Flex>
          </div>

          <div className="container-1280 margin-bottom-10 wf-section">
            <Performance name={'MFI Brands - Performance by Fortified Staple Food Vehicle'} />
          </div>
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
