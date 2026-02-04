import React, {useState, useEffect} from 'react';
import {Flex, useToast, Spinner} from '@chakra-ui/react';
import {request} from 'common';
import Tab from './components/tab';
import briefCaseSelected from 'assets/images/fi_briefcaseSelected.svg';
import boxActive from 'assets/images/fi_boxActive.svg';
import truckActive from 'assets/images/fi_truckActive.svg';
import governActive from 'assets/images/GovernActive.svg';
import publicActive from 'assets/images/fi_globeActive.svg';
import briefCaseActive from 'assets/images/fi_briefcaseActive.svg';
import boxSelected from 'assets/images/fi_boxSelected.svg';
import truckSelected from 'assets/images/fi_truckSelected.svg';
import governSelected from 'assets/images/GovernSelected.svg';
import Tabs from './components/Tabs';
import TabPane from './components/Tabpane';
import publicSelected from 'assets/images/fi_globeSelected.svg';
import {nanoid} from '@reduxjs/toolkit';
import EmptyTab from './components/empty-tab';
import {useSelector} from 'react-redux';
// import UploadFileModal from './components/upload-file-modal';

export const cats = [
  {
    category: 'Personnel',
    icon1: briefCaseActive,
    icon2: briefCaseSelected,
    component: Tab,
  },
  {
    category: 'Production',
    icon1: boxActive,
    icon2: boxSelected,
    component: Tab,
  },
  {
    category: 'Procurement & Suppliers',
    icon1: truckActive,
    icon2: truckSelected,
    component: Tab,
  },
  {
    category: 'Public Engagement',
    icon1: publicActive,
    icon2: publicSelected,
    component: Tab,
  },
  {
    category: 'Governance',
    icon1: governActive,
    icon2: governSelected,
    component: Tab,
  },
];

// console.log('here3');

/**
 * SelfAssessment page component that renders the SAT categories and handles category loading,
 * company cycle retrieval, and conditional UI display (loading, locked, empty, or main view).
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.showSideBar - Function to toggle the sidebar visibility
 * @returns {JSX.Element} Self-assessment UI with categories and conditional rendering
 */
const selfAssessment = ({showSideBar}) => {
  // Controls overall loading state
  const [loading, setLoading] = useState(true);
  // Current logged-in user pulled from Redux store
  const user = useSelector((state) => state.auth.user);
  const toast = useToast();
  const [progress] = useState(0);
  // Stores fetched company information
  const [companyDetails, setCompanyDetails] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState({});
  const [finish, setFinish] = useState(false);
  const [locked, setLocked] = useState(false);
  // const [subTab, setSubTab] = useState(null);
  const [cycle, setCycle] = useState(null);

  /**
   * Fetches company details for the current user and assessment cycle.
   * @param {string} id - The company ID
   * @returns {Promise<void>}
   */
  const getCompanyDetails = async (id) => {
    try {
      setLoading(true);
      const {data: res} = await request(true).get(`/company/details/?company-id=${id}&cycle-id=${cycle.id}`);
      setCompanyDetails(res.company);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  /**
   * Fetches assessment categories and sets corresponding icons/components.
   * Also retrieves the active cycle and company details.
   * @returns {Promise<void>}
   */
  const getCategories = async () => {
    try {
      const {data: res} = await request(true).post('/questions/categories', {
        sorted: 1,
      });
      const {data: cyc} = await request(true).get(
        `/company/active-cycle`
      );
      setLocked(cyc?.locked);
      setCycle(cyc);
      const plainCategories = res.data;
      const category = [];
      plainCategories
        .filter((val) => val.id !== 'mQ0t5QvDRNae05mc1XVw')
        .forEach((val) => {
          let ctegory = {};
          cats.forEach((cat) => {
            if (val.name === cat.category) {
              ctegory = {
                ...val,
                icon1: cat.icon1,
                icon2: cat.icon2,
                component: cat.component,
                cycle: cyc
              };
            }
          });

          category.push(ctegory);
        });
      setCategories(category.sort((a, b) => a.sort_order - b.sort_order));
      getCompanyDetails(user.company_user.company_id);
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

  // Trigger initial data load on component mount
  useEffect(() => {
    getCategories();
  }, []);

  // Render locked message if SAT is locked
  return locked ? (
    <Flex
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center
    "
    >
      <h1>Sorry SAT has been locked!</h1>
    </Flex>
  ) :
  // Render loading spinner while fetching data
    loading ? (
      <Flex
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center
    "
      >
        <Spinner />
      </Flex>
    ) :
    // Render main Tabs UI when company tier is available
      companyDetails?.tier ? (
        <>
          <Tabs
            progress={progress}
            showSideBar={showSideBar}
            activeTab={activeTab}
            companyDetails={companyDetails}
            setActiveTab={setActiveTab}
            finish={finish}
            setFinish={(val) => setFinish(val)}
            selectedSubCat={selectedSubCat}
            setSelectedSubCat={(val) => setSelectedSubCat(val)}
          >
            {categories.map(({component: Comp, name, icon2, icon1, id, children, cycle}) => (
              <TabPane
                name={name}
                categoryId={id}
                icon1={icon1}
                icon2={icon2}
                key={nanoid()}
                subCategories={children}
              >
                <Comp
                  cycle={cycle}
                  name={name}
                  companyDetails={companyDetails}
                  categoryId={id}
                  finish={finish}
                  setFinish={(val) => setFinish(val)}
                  selectedSubCat={selectedSubCat}
                  subCategories={children}
                  setSelectedSubCat={(val) => setSelectedSubCat(val)}
                />
              </TabPane>
            ))}
          </Tabs>

          {/* <UploadFileModal /> */}
        </>
      ) :
      // Render fallback/empty tab if company tier is not set
          (
            <Flex flex="1" minHeight="90vh" className="padding-0 background-color-white">
              <EmptyTab progress={null} getCompanyDetails={getCompanyDetails} />
            </Flex>
          );
};

export default selfAssessment;
