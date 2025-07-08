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
import AssessmentOverview from './assessment-overview';

/**
 * Tabs component renders the sidebar and dynamic content for the Self-Assessment Tool.
 * It provides the company name, progress bar, category tabs, and subcategory selections.
 * It also switches the view based on selected category and renders corresponding children.
 *
 * @component
 * @param {Object} props - Props for the Tabs component
 * @param {React.ReactNode} props.children - The TabPane elements passed as children
 * @param {number} props.progress - Overall assessment progress percentage
 * @param {Function} props.showSideBar - Function to toggle the sidebar visibility
 * @param {string} props.activeTab - Currently active tab name
 * @param {Function} props.setActiveTab - Function to set the active tab
 * @param {Object} props.companyDetails - Current company profile details
 * @param {Object} props.selectedSubCat - Currently selected subcategory
 * @param {Function} props.setSelectedSubCat - Function to update selected subcategory
 * @param {Function} props.setFinish - Function to update finish state
 * @returns {JSX.Element} Rendered Tabs component with category and subcategory sidebar and content display
 */
const Tabs = (props) => {
  const {
    children,
    progress,
    showSideBar,
    activeTab,
    setActiveTab,
    companyDetails,
    selectedSubCat,
    setSelectedSubCat,
    setFinish,
  } = props;
  const [mobile] = useMediaQuery('(min-width: 800px)');
  const tabRef = useRef();
  const [childContent, setChildConent] = useState({});
  const [tabHeader, setTabHeader] = useState([]);
  const [loading] = useState(false);
  const [cascade, setCascade] = useState(false);
  const [subCategory, setSubCategory] = useState([]);

  // Extract tab headers and child content from children elements
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
  // Set active tab and its subcategories on change
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

  // Handle click event for category or subcategory selection
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

  return (
    <Flex>
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
                src={`https://ui-avatars.com/api/?background=random&name=${companyDetails?.company_name.trim()}$rounded=true`}
                loading="lazy"
                width="48"
                style={{borderRadius: '50%'}}
                alt=""
                className="rounded-large margin-right-4"
              />
              <div>
                <h6 className="margin-bottom-1">{companyDetails?.company_name}</h6>
                {/* <div className="text-small">Nigeria - Sugar</div> */}
              </div>
            </div>
          </div>
          <div className="height-20"></div>
          <div className="padding-bottom-10">
            {/* Display progress bar if progress > 0 */}
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
              {/* Render category headers with expandable icons */}
              {tabHeader.map(({name: item, icon1, icon2}) => {
                return (
                  <Stack
                    key={nanoid()}
                    style={
                      isNumber(progress) ?
                        null :
                          {
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
                                activeTab === item && cascade ?
                                  dropDownExpanded :
                                  dropDownCompressed
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
                    {/* Render subcategories under the active tab */}
                    {activeTab === item && cascade ?
                      subCategory.map((val) => (

                        <div
                          key={nanoid()}
                          onClick={() => {
                            isNumber(progress) && onClickTabItem(item, 1, val);
                          }}
                          className="flex-row-middle flex-space-between padding-x-4 padding-y-3 background-secondary"
                          style={
                            selectedSubCat?.id === val.id ? {backgroundColor: 'darkgray'} : {}
                          }
                        >
                          <div className="text-small weight-medium text-color-body-text">
                            {val.name}
                          </div>
                        </div>
                      )) :
                      ''}
                  </Stack>
                );
              })}
            </div>
          </div>
        </div>
      </Stack>
      {/* Show child content for active tab or default overview if no tab is selected */}
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
        <AssessmentOverview
          tabHeaders={tabHeader} onClickTabItems={onClickTabItem} progress={progress} />
      )}
    </Flex>
  );
};

Tabs.propTypes = {
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
