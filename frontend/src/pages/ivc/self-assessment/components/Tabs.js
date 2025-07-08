import React, {useState, useEffect} from 'react';
import dropDownCompressed from 'assets/images/DropdownCompressed.svg';
import dropDownExpanded from 'assets/images/dropdownExpanded.svg';
import propTypes from 'prop-types';
import {FaBars} from 'react-icons/fa';
import {useMediaQuery, Progress, Spinner, Flex, Stack} from '@chakra-ui/react';
import {nanoid} from '@reduxjs/toolkit';
import TabPane from './Tabpane';
import {isNumber} from 'validate.js';
import {useRef} from 'react';
import {BiArrowBack} from 'react-icons/bi';
import AssessmentOverview from './assessment-overview';
import {Link} from 'react-router-dom';

/**
 * Tabs component displays self-assessment categories and subcategories in a sidebar
 * and renders their respective content. It manages tab switching, subcategory selection,
 * and interaction with the active assessment state.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.cycle - Current assessment cycle data
 * @param {React.ReactNode} props.children - TabPane children components
 * @param {number} props.progress - Completion progress percentage
 * @param {Function} props.showSideBar - Toggles the sidebar on mobile
 * @param {string} props.activeTab - Currently selected category tab
 * @param {Function} props.setActiveTab - Updates the selected tab
 * @param {Object} props.selectedSubCat - Currently selected subcategory
 * @param {Function} props.setSelectedSubCat - Sets the selected subcategory
 * @param {Function} props.setFinish - Sets the assessment finish state
 * @returns {JSX.Element} Tabs layout with sidebar navigation and content panel
 */
const Tabs = (props) => {
  const {
    cycle,
    children,
    progress,
    showSideBar,
    activeTab,
    setActiveTab,
    selectedSubCat,
    setSelectedSubCat,
    setFinish
  } = props;
  const [mobile] = useMediaQuery('(min-width: 800px)');
  const tabRef = useRef();
  const [childContent, setChildConent] = useState({});
  const [tabHeader, setTabHeader] = useState([]);
  const [loading] = useState(false);
  const [cascade, setCascade] = useState(false);
  const [subCategory, setSubCategory] = useState([]);

  // Extract headers and children from TabPane elements
  useEffect(() => {
    const headers = [];
    const childCnt = {};
    React.Children.forEach(children, (element) => {
      if (!React.isValidElement(element)) return;
      const {...rest} = element.props;
      headers.push({...rest});
      childCnt[element.props.name] = element.props.children;
    });
    tabRef.current = headers;
    setTabHeader(headers);
    setChildConent({...childCnt});
  }, [props, children]);

  // Update state based on activeTab changes (set cascade & subcategory)
  useEffect(() => {
    const value = activeTab;
    // const value = activeTab || 'Personnel';
    const active = tabRef.current.filter((val) => val.name === value)[0];
    if (active) {
      setActiveTab(active?.name);
      setCascade(true);
      setSubCategory(active?.subCategories);
      setSelectedSubCat(active?.subCategories[0]);
    }
  }, [activeTab, tabRef]);

  /**
   * Handles clicking on a tab or subcategory item.
   * Toggles the cascade view or sets subcategory accordingly.
   *
   * @param {string} tab - The category tab name
   * @param {boolean} type - True if clicked item is a subcategory
   * @param {Object} subCategoryDetails - Selected subcategory details
   */
  const onClickTabItem = (tab, type, subCategoryDetails) => {
    if (tab === activeTab && !type) {
      setCascade(!cascade);
      setFinish(false);
    } else if (tab === activeTab && type) {
      setCascade(true);
      setFinish(false);
      setSelectedSubCat(subCategoryDetails);
      return;
    } else {
      const subCat = tabHeader.filter((val) => val.name === tab)[0].subCategories;
      setCascade(true);
      setSubCategory(subCat);
      setFinish(false);
      setSelectedSubCat(subCat[0]);
      setActiveTab(tab);
    }
  };


  const currentCompany = JSON.parse(localStorage.getItem('company'));
  return (
    // Layout wrapper for sidebar and content area
    <Flex>
      {/* Sidebar layout showing company info and category tabs */}
      <Stack className="padding-0 background-color-4 height-viewport-full overflow-scroll sticky-top-0">
        <div
          className="padding-0 background-color-4 height-viewport-full overflow-scroll sticky-top-0 w-col w-col-3"
          style={{
            width: 360,
          }}
        >
          <div className="fixed background-color-4 width-full">
            <div className="flex-row-middle padding-x-5 padding-y-4 border-bottom-1px height-20 width-full">
              <button
                onClick={() => showSideBar()}
                style={{marginRight: 5, display: mobile ? 'none' : ''}}
              >
                {' '}
                <FaBars />{' '}
              </button>
              <img
                src={`https://ui-avatars.com/api/?background=random&name=${currentCompany.company_name}$rounded=true`}
                loading="lazy"
                width="48"
                style={{borderRadius: '50%'}}
                alt=""
                className="rounded-large margin-right-4"
              />
              <div>
                <h6 className="margin-bottom-1">{currentCompany.company_name}</h6>
                {/* <div className="text-small">Nigeria - Sugar</div> */}
              </div>
            </div>
          </div>
          <div className="height-20"></div>
          <Flex
            className="margin-x-5  rounded-large box-shadow-small margin-bottom-2 margin-top-5"
            bg="rgba(0, 0, 0, 0.05)"
          >
            <div className="flex-row-middle flex-space-between padding-4">
              <Link to="/admin/companies-index">
                <Stack bg="white" borderRadius="50%" mr={4}>
                  <BiArrowBack size={25} />
                </Stack>
              </Link>
              <div className="text-base weight-bold">Back to index</div>
            </div>
          </Flex>
          <div className="padding-bottom-10">
            {progress > 0 ? (
              <>
                <div className="padding-top-6 padding-bottom-4 padding-left-5">
                  <div className="text-sub-header">OVERALL PROGRESS</div>
                </div>
                <div className="margin-x-5 background-color-white rounded-large box-shadow-small margin-bottom-2">
                  <div className="flex-row-middle flex-space-between padding-4">
                    <div className="height-2 width-9-12 rounded-full background-hover">
                      <Progress
                        className="height-2 rounded-full background-brand"
                        colorScheme="whatsapp"
                        color="#00b37a"
                        size="sm"
                        value={progress}
                      />
                    </div>
                    <div className="text-base weight-bold">{progress}%</div>
                  </div>
                </div>
              </>
            ) : (
              ''
            )}
            <div className="padding-top-6 padding-bottom-4 padding-left-5">
              <div className="text-sub-header">CATEGORIES</div>
            </div>
            <div className="margin-x-5 background-color-white rounded-large box-shadow-small">
              {/* Render each category and its collapsible subcategories */}
              {tabHeader.map(({name: item, icon1, icon2}) => {
                return (
                  <Stack
                    key={nanoid()}
                    style={
                      isNumber(progress)
                        ? null
                        : {
                            pointerEvents: 'none',

                            /* for "disabled" effect */
                            opacity: 0.5,
                            background: '`#CCC`',
                          }
                    }
                  >
                    <div className="flex-row-middle flex-space-between padding-4 border-bottom-1px">
                      <div className="flex-row-middle">
                        <img
                          src={activeTab === item && cascade ? icon2 : icon1}
                          loading="lazy"
                          width="24"
                          alt=""
                          className="margin-right-4"
                        />
                        <div
                          className={`text-base medium ${activeTab === item && cascade ? 'text-color-green' : ''
                          }`}
                        >
                          {item}
                        </div>
                      </div>
                      <div className="width-10 height-10 flex-justify-center flex-row-middle">
                        {loading && activeTab === item ? (
                          <Spinner />
                        ) : (
                          <div
                            style={{
                              paddding: 10,
                              cursor: 'pointer',
                              background: '#FAFAFA',
                              borderRadius: '100%',
                            }}
                            onClick={() => isNumber(progress) && onClickTabItem(item)}
                          >
                            <img
                              src={
                                activeTab === item && cascade
                                  ? dropDownExpanded
                                  : dropDownCompressed
                              }
                              loading="lazy"
                              width="30"
                              height="30"
                              alt="drop"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {activeTab === item && cascade
                      ? subCategory.map((val) => (
                        <div
                          key={nanoid()}
                          onClick={() => isNumber(progress) && onClickTabItem(item, 1, val)}
                          className="flex-row-middle flex-space-between padding-x-4 padding-y-3 background-secondary"
                          style={
                            selectedSubCat?.id === val.id ? {backgroundColor: 'darkgray'} : {}
                          }
                        >
                          <div className="text-small weight-medium text-color-body-text">
                            {val.name}
                          </div>
                        </div>
                      ))
                      : ''}
                  </Stack>
                );
              })}
            </div>
          </div>
        </div>
      </Stack>

      {/* Render selected tab's child content */}
      {activeTab ? (
        Object.keys(childContent).map((key) => {
          if (key === activeTab) {
            return (
              <Stack flex="1" key={key}>
                {childContent[key]}
              </Stack>
            );
          } else {
            return null;
          }
        })
      ) : (
        // If no activeTab, render default overview
        <AssessmentOverview cycle={cycle} tabHeaders={tabHeader} />
      )}
    </Flex>
  );
};

Tabs.propTypes = {
  cycle: propTypes.any,
  children: function (props, propName, componentName) {
    const prop = props[propName];

    let error = null;
    React.Children.forEach(prop, function (child) {
      if (child.type !== TabPane) {
        error = new Error('`' + componentName + '` children should be of type `TabPane`.');
      }
    });
    return error;
  },
  progress: propTypes.any,
  setSelectedSubCat: propTypes.any,
  companyDetails: propTypes.any,
  selectedSubCat: propTypes.any,
  showSideBar: propTypes.any,
  activeTab: propTypes.any,
  setActiveTab: propTypes.any,
  finish: propTypes.any,
  setFinish: propTypes.any,

};

export default Tabs;
