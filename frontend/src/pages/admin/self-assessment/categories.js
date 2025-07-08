import React, {useState} from 'react';
import dangote from 'assets/images/Dangote Logo.svg';
import dropDownCompressed from 'assets/images/DropdownCompressed.svg';
import dropDownExpanded from 'assets/images/dropdownExpanded.svg';
import briefCaseSelected from 'assets/images/fi_briefcaseSelected.svg';
import boxActive from 'assets/images/fi_boxActive.svg';
import truckActive from 'assets/images/fi_truckActive.svg';
import governActive from 'assets/images/GovernActive.svg';
import publicActive from 'assets/images/fi_globeActive.svg';
import briefCaseActive from 'assets/images/fi_briefcaseActive.svg';
import boxSelected from 'assets/images/fi_boxActive.svg';
import truckSelected from 'assets/images/fi_truckSelected.svg';
import governSelected from 'assets/images/GovernSelected.svg';
import publicSelected from 'assets/images/fi_globeSelected.svg';
import propTypes from 'prop-types';
import {FaBars} from 'react-icons/fa';
import {useMediaQuery, Progress} from '@chakra-ui/react';
import {nanoid} from '@reduxjs/toolkit';
import Personal from './personal';
import ComingSoon from 'components/coming-soon';
import {Link, useRouteMatch} from 'react-router-dom';

export const cats = [
  {
    category: 'Personnel',
    icon1: briefCaseActive,
    icon2: briefCaseSelected,
    subCategory: [
      {
        name: 'Roles & Responsibilities: Structural...',
        path: 'role',
        exact: true,
        page: Personal,
      },
      {
        name: 'Recruitment: Standards, Processes...',
        path: 'recruitment',
        exact: true,
        page: Personal,
      },
      {
        name: 'Induction & Training',
        path: 'induction',
        exact: true,
        page: Personal,
      },
      {
        name: 'Objectives & Performance Manage...',
        path: 'objectives',
        exact: true,
        page: Personal,
      },
      {
        name: 'Renumeration & Incentives',
        path: 'renumeration',
        exact: true,
        page: Personal,
      },
    ],
  },
  {
    category: 'Production',
    icon1: boxActive,
    icon2: boxSelected,
    subCategory: [{name: 'Hello word', path: 'hello', exact: true, page: ComingSoon}],
  },
  {
    category: 'Procurement & Supply',
    icon1: truckActive,
    icon2: truckSelected,
    subCategory: [],
  },
  {
    category: 'Public Engagement',
    icon1: publicActive,
    icon2: publicSelected,
    subCategory: [],
  },
  {
    category: 'Governance',
    icon1: governActive,
    icon2: governSelected,
    subCategory: [],
  },
];

/**
 * Renders the left-hand sidebar navigation for self-assessment categories.
 * Includes logo, progress bar, and category dropdowns for Personnel, Production, etc.
 *
 * @component
 * @param {Object} props - React component props
 * @param {Function} props.showSideBar - Function to toggle the sidebar on mobile
 * @returns {JSX.Element} The rendered category sidebar UI
 */
const categories = ({showSideBar}) => {
  // Check if screen width is at least 800px (used to toggle sidebar visibility)
  const [mobile] = useMediaQuery('(min-width: 800px)');
  // Progress value to be shown in progress bar (currently static)
  const [progress] = useState(0);
  // Track currently expanded category tab
  const [activeTab, setActiveTab] = useState(0);
  const {path} = useRouteMatch();

  // Toggle dropdown expansion state for a category
  const toggleDropDown = (i) => {
    if (activeTab === i) {
      setActiveTab(null);
    } else {
      setActiveTab(i);
    }
  };

  return (
    <>
      {/* Sidebar container */}
      <div
        className="padding-0 background-color-4 height-viewport-full overflow-scroll sticky-top-0 w-col w-col-3"
        style={{
          width: 360,
        }}
      >
        {/* Header with logo and company name */}
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
              src={dangote}
              loading="lazy"
              width="48"
              alt=""
              className="rounded-large margin-right-4"
            />
            <div>
              <h6 className="margin-bottom-1">Dangote Flour Mills</h6>
              <div className="text-small">Nigeria - Sugar</div>
            </div>
          </div>
        </div>
        <div className="height-20"></div>
        <div className="padding-bottom-10">
          {/* Display user's overall progress */}
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
          {/* Render collapsible list of category tabs and subcategories */}
          <div className="padding-top-6 padding-bottom-4 padding-left-5">
            <div className="text-sub-header">CATEGORIES</div>
          </div>
          <div className="margin-x-5 background-color-white rounded-large box-shadow-small">
            {cats.map(({category, icon1, icon2, subCategory}, i) => (
              // Category click toggles expansion
              <div key={nanoid()} onClick={() => toggleDropDown(i)}>
                <div className="flex-row-middle flex-space-between padding-4 border-bottom-1px">
                  <div className="flex-row-middle">
                    <img
                      src={activeTab === i ? icon2 : icon1}
                      loading="lazy"
                      width="24"
                      alt=""
                      className="margin-right-4"
                    />
                    <div
                      className={`text-base medium ${activeTab === i ? 'text-color-green' : ''}`}
                    >
                      {category}
                    </div>
                  </div>
                  <div className="width-10 height-10 flex-justify-center flex-row-middle">
                    <img
                      src={activeTab === i ? dropDownExpanded : dropDownCompressed}
                      loading="lazy"
                      width="20"
                      height="20"
                      alt=""
                    />
                  </div>
                </div>
                {/* eslint-disable */}
                {/* Render subcategory links if parent tab is expanded */}
                {activeTab === i
                  ? subCategory.map((val) => (
                      <Link
                        to={`${path}/${val.path}`}
                        key={nanoid()}
                        className="flex-row-middle flex-space-between padding-x-4 padding-y-3 background-secondary"
                      >
                        <div className="text-small weight-medium text-color-body-text">
                          {val.name}
                        </div>
                      </Link>
                    ))
                  : ''}
                {/* eslint-enable */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

categories.propTypes = {
  showSideBar: propTypes.any,
};

export default categories;
