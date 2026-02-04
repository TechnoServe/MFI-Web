import React, {useEffect, useState} from 'react';
import avatars from 'assets/images/Avatar Group (24px).svg';
import {Text} from '@chakra-ui/react';
import dropDownCompressed from 'assets/images/DropdownCompressed.svg';
import Tippy from '@tippyjs/react';

import fullyMet from 'assets/images/Fullymet.svg';
import notMet from 'assets/images/Notmet.svg';

import dropDownExpanded from 'assets/images/dropdownExpanded.svg';
import proptypes from 'prop-types';
import {nanoid} from '@reduxjs/toolkit';
import {request} from 'common';
import {getCurrentCompany} from '../../../../utills/helpers';
import InviteMember from 'pages/company/settings/components/inviteMember';

/**
 * AssessmentOverview displays a self-assessment interface including categories, subcategories,
 * and evidence statuses (both company-submitted and IVC-reviewed). Allows toggling of subcategories
 * and launching the invite member modal.
 *
 * @component
 * @param {Object} props - Props passed to the component
 * @param {Object} props.cycle - Current assessment cycle data
 * @param {Array} props.tabHeaders - List of category headers with subcategories
 * @returns {JSX.Element} Self-assessment category view with evidence evaluation
 */
const AssessmentOverview = ({cycle, tabHeaders}) => {
  const [categories, setCategories] = useState([]);
  const [cascade, setCascade] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [activeSubCat, setActiveSubCat] = useState(null);
  const [subCategory, setSubCategory] = useState([]);
  const [evidenceStatus, setEvidenceStatus] = useState([]);
  const [evidenceIVCStatus, setEvidenceIVCStatus] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Update the category list whenever tabHeaders changes
  useEffect(() => {
    setCategories(tabHeaders);
  }, [tabHeaders]);

  /**
   * Handles click on category or subcategory tab, fetches evidence and comment data.
   * Toggles collapse behavior or loads evidence depending on click type.
   *
   * @param {string} tab - The selected category name
   * @param {boolean} [type] - True if the tab is a subcategory
   * @param {Object} [subCategoryDetails] - The selected subcategory object
   */
  const onClickTabItem = (tab, type, subCategoryDetails) => {
    if (tab === activeTab && !type) {
      setCascade(!cascade);
    } else if (tab === activeTab && type) {
      setCascade(true);
      setActiveSubCat(subCategoryDetails.name);
      return;
    } else {
      const subCat = categories.filter((val) => val.name === tab)[0].subCategories;

      const categoryIds = subCat.map((x) => x.id);
      const currentCompany = getCurrentCompany();
      const {id: companyId} = currentCompany;
      const body = {
        'company-id': companyId,
        'category-ids': categoryIds,
        'cycle-ids': cycle.id,
        'showUnapproved': 1
      };
      // Evidence Status
      const getEvidenceStatus = async () => {
        const {data} = await request(true).post(`/sat/get/answers`, body);
        const {
          data: {responses: ivcResponses},
        } = await request(true).post(`/sat/get/ivc/answers`, body);

        setEvidenceStatus(data.responses);
        setEvidenceIVCStatus(ivcResponses);
      };
      getEvidenceStatus();

      // Comments
      const getComment = async () => {
        const currentCompany = getCurrentCompany();
        const {id: companyId} = currentCompany;
        await request(true).get(`/comments/list/category/${categoryIds}?company_id=${companyId}`);
      };
      getComment();
      setCascade(true);
      setSubCategory(subCat);
      setActiveTab(tab);
    }
  };

  /**
   * Checks if the company's answer matches a specific tier/category/value.
   *
   * @param {string} tier - The evidence tier level
   * @param {number} categoryId - The ID of the category/subcategory
   * @param {string} value - The evidence value to match (e.g., "FULLY_MET")
   * @returns {boolean} Whether a matching company answer was found
   */
  const getCompanyAnswer = (tier, categoryId, value) => {
    for (let i = 0; i < evidenceStatus.length; i++) {
      const data = evidenceStatus[i];
      if (data.tier == tier && data.category_id == categoryId && data.value == value) return true;
    }
    return false;
  };

  // Evidence Status


  return (
    // Main wrapper for the self-assessment overview content
    <div
      className="padding-x-0 background-secondary border-left-1px w-col w-col-7"
      style={{width: '70%'}}
    >
      <div className="flex-row-middle flex-space-between padding-x-10 padding-y-4 border-bottom-1px height-20 background-color-white sticky-top-0">
        <div>
          <Text fontWeight="bold" className="margin-bottom-1">
            Self Assessment
          </Text>
        </div>
        <div className="flex-space-between flex-row-middle">
          <img src={avatars} loading="lazy" height="32" alt="" className="margin-right-3" />
          {/* Add member button to open invite modal */}
          <a
            onClick={() => setShowModal(!showModal)}
            className="button-secondary button-small w-button"
          >
            Add member
          </a>
        </div>
      </div>
      {/* start assessment overview */}
      <div className="padding-x-10 padding-top-8 padding-bottom-5">
        <Text
          fontSize="1.4rem"
          lineHeight={1.1}
          fontWeight="bold"
          className="weight-medium margin-bottom-2"
        >
          Assessment Overview
        </Text>
        <Text
          className="text-base text-color-body-text"
          color="rgba(28, 29, 38, 0.6)"
          fontSize="1rem"
        >
          Get started by entering a category.
        </Text>
      </div>
      <div className="padding-x-10 padding-bottom-10">
        <div className="border-1px rounded-large">
          {/* Render each category block with expandable subcategories */}
          {categories.map((val) => (
            <div key={nanoid()}>
              <div
                onClick={() => onClickTabItem(val.name)}
                className="padding-x-4 background-secondary padding-y-3 flex-space-between cursor-click"
              >
                <div className="flex-row-middle">
                  <img
                    src={val.icon1}
                    loading="lazy"
                    width="16"
                    alt=""
                    className="margin-right-2 margin-bottom-1"
                  />
                  <div className="text-small weight-medium text-color-body-text">{val.name}</div>
                </div>
                <img
                  src={activeTab === val.name && cascade ? dropDownExpanded : dropDownCompressed}
                  loading="lazy"
                  alt=""
                />
              </div>
              {activeTab === val.name && cascade
                ?
                // Render subcategory details including evidence status
                subCategory.map((subCat) => (
                  <div
                    key={nanoid()}
                    className={`padding-4 grid-2-columns border-bottom-1px ${activeSubCat === subCat.name
                      ? 'cursor-click background-color-blue-lighter'
                      : ''
                    }`}
                  >
                    <div>
                      <div className="text-base medium">{subCat.name}</div>
                    </div>
                    <div
                      id="w-node-_212c762e-30ec-edff-fed5-6c5419fe4e93-bc3a0a40"
                      className="flex-space-between flex-row-middle"
                    >
                      <div className="flex-column-middle">
                        <div className="flex-row-middle">
                          <div className="flex-row margin-right-4 padding-1">
                            <div className="text-base text-color-body-text">Tier 1</div>
                            <img style={{visibility: 'hidden'}} src={fullyMet} loading="lazy" alt=""className="margin-x-1"/>
                          </div>
                          <div className="flex-row margin-right-4 padding-1">
                            <div className="text-base text-color-body-text">Tier 2</div>
                            <img style={{visibility: 'hidden'}} src={fullyMet} loading="lazy" alt=""className="margin-x-1"/>
                          </div>
                          <div className="flex-row margin-right-4 padding-1">
                            <div className="text-base text-color-body-text">Tier 3</div>
                            <img style={{visibility: 'hidden'}} src={fullyMet} loading="lazy" alt=""className="margin-x-1"/>
                          </div>
                        </div>
                        <div className="flex-row-middle">
                          {/* Display company-selected evidence values */}
                          {evidenceStatus.length > 0 ? evidenceStatus.map((evidence) => subCat.id == evidence.category_id ? (
                            <div key={nanoid()}>
                              <div className="flex-row margin-right-4 padding-1">
                                <Tippy
                                  content={
                                    evidence.value === 'NOT_MET'
                                      ? `Company selected not met for ${evidence.tier}`
                                      : evidence.value === 'FULLY_MET'
                                        ? `Company selected fully met for ${evidence.tier}`
                                        : evidence.value === 'PARTLY_MET'
                                          ? `Company selected partly met for ${evidence.tier}`
                                          : evidence.value === 'MOSTLY_MET'
                                            ? `Company selected mostly met for ${evidence.tier}`
                                            : `Company selected no evidence status for ${evidence.tier}`
                                  }
                                >
                                  <div className="text-base text-color-body-text">
                                    {evidence.value}
                                  </div>
                                </Tippy>
                              </div>
                            </div>
                          ):(
                            <div key={nanoid()}>
                            </div>
                          )) :(
                            <div className="flex-row-middle">

                            </div>

                          )}


                        </div>
                        <div className="flex-row-middle">
                          {/* Display IVC-selected evidence values and validation icons */}
                          {evidenceIVCStatus.length > 0 ? evidenceIVCStatus.map((evidence) => subCat.id == evidence.category_id ? (
                            <div key={nanoid()}>
                              <div className="flex-column margin-right-4 padding-1">
                                <Tippy
                                  content={
                                    evidence.value === 'NOT_MET'
                                      ? `IVC selected not met for ${evidence.tier}`
                                      : evidence.value === 'FULLY_MET'
                                        ? `IVC selected fully met for ${evidence.tier}`
                                        : evidence.value === 'PARTLY_MET'
                                          ? `IVC selected partly met for ${evidence.tier}`
                                          : evidence.value === 'MOSTLY_MET'
                                            ? `IVC selected mostly met for ${evidence.tier}`
                                            : `IVC selected no evidence status for ${evidence.tier}`
                                  }
                                >
                                  <div className="text-base text-color-body-text">
                                    {evidence.value}
                                  </div>
                                </Tippy>
                                {getCompanyAnswer(evidence.tier, evidence.category_id, evidence.value) ? (
                                  <img
                                    style={{width: '40px', height: '40px', margin: '0px auto'}}
                                    src={fullyMet}
                                    loading="lazy"
                                    alt=""
                                  />
                                ):(
                                  <img
                                    style={{width: '40px', height: '40px', margin: '0px auto'}}
                                    src={notMet}
                                    loading="lazy"
                                    alt=""
                                  />
                                )
                                }

                              </div>
                            </div>
                          ):(
                            <div key={nanoid()}>
                            </div>
                          )) :(
                            <div className="flex-row-middle">

                            </div>

                          )}
                        </div>
                      </div>

                      <a href="#" className="button-secondary button-small w-button">
                        View
                      </a>
                    </div>
                  </div>
                ))
                : ''}
            </div>
          ))}
        </div>
      </div>
      {/* Invite member modal for adding collaborators */}
      <InviteMember showInviteModal={showModal} setShowInviteModal={setShowModal} />
    </div>
  );
};

AssessmentOverview.propTypes = {
  cycle: proptypes.any,
  tabHeaders: proptypes.any,
};

export default AssessmentOverview;
