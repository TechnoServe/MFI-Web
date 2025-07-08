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
import propTypes from 'prop-types';
// import {useSelector} from 'react-redux';
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

const IvcAssessment = ({cycle, showSideBar, companyDetailsIVC}) => {
  // console.log('here3', cycle);
  // const user = useSelector((state) => state.auth.user);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  // const user = useSelector((state) => state.auth.user);
  const [progress] = useState(0);
  // const [companyDetails, setCompanyDetails] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState({});
  const [finish, setFinish] = useState(false);
  // const [subTab, setSubTab] = useState(null);

  // const getCompanyDetails = async (id) => {
  //   try {
  //     setLoading(true);
  //     const {data: res} = await request(true).get(`/company/details/?company-id=${id}`);
  //     setCompanyDetails(res.company);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };

  const getCategories = async () => {
    try {
      const {data: res} = await request(true).post('/questions/categories', {
        sorted: 1,
      });
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
                cycle: cycle
              };
            }
          });

          category.push(ctegory);
        });
      setCategories(category.sort((a, b) => a.sort_order - b.sort_order));
      setLoading(false);
      // getCompanyDetails(user.company_user.company_id);
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

  useEffect(() => {
    getCategories();
  }, []);

  return loading ? (
    <Flex
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center
    "
    >
      <Spinner />
    </Flex>
  ) : (
    <>
      <Tabs
        cycle={cycle}
        progress={progress}
        showSideBar={showSideBar}
        activeTab={activeTab}
        companyDetails={{}}
        setActiveTab={setActiveTab}
        finish={finish}
        setFinish={(val) => setFinish(val)}
        selectedSubCat={selectedSubCat}
        setSelectedSubCat={(val) => setSelectedSubCat(val)}
        companyDetailsIVC={companyDetailsIVC}
      >
        {categories.map(({component: Comp, name, icon2, icon1, id, children, cycle: cyc}) => (
          <TabPane
            name={name}
            categoryId={id}
            icon1={icon1}
            icon2={icon2}
            key={nanoid()}
            subCategories={children}
          >
            <Comp
              cycle={cyc}
              name={name}
              companyDetails={{}}
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
  );
};

IvcAssessment.propTypes = {
  showSideBar: propTypes.any,
  companyDetailsIVC: propTypes.any,
  cycle: propTypes.any
};

export default IvcAssessment;
