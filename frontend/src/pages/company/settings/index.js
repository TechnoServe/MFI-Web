import React, {useState, useEffect} from 'react';
import Account from './components/account';
import Company from './components/company';
import InviteMember from './components/inviteMember';
import Team from './components/team';
import {request} from 'common';
import {useAuth} from 'hooks/user-auth';
import Brands from './components/brands';

/**
 * Settings component is the main container for the Company Settings page.
 * It handles tab switching and data fetching for account, team, company, and brand settings.
 *
 * @component
 * @returns {JSX.Element} Rendered settings page with tab navigation and modals
 */
const Settings = () => {
  // Active tab index (0 = Account, 1 = Team, 2 = Company, 3 = Brands)
  const [tab, setTab] = useState(0);
  // Stores the company details fetched from the backend
  const [companyDetails, setCompanyDetails] = useState(null);
  // Controls visibility of the InviteMember modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  // State to store fetched team member data and loading states
  const [membersData, setMembersData] = useState({
    fetched: false,
    fetching: false,
    idBeingRemoved: null,
    data: [],
  });
  // Stores staff size options fetched from the backend
  const [staffSizeData, setStaffSizeData] = useState({fetched: false, fetching: false, data: []});
  // Stores product type options fetched from the backend
  const [productTypesData, setProductTypesData] = useState({
    fetched: false,
    fetching: false,
    data: [],
  });
  const {user} = useAuth();

  /**
   * Fetches company members from the backend.
   * @param {boolean} refresh - Whether to force refresh even if already fetched
   */
  const fetchCompanyMembers = (refresh = false) => {
    if (membersData.fetched && !refresh) return;
    setMembersData({...membersData, fetching: true});
    request(true)
      .get(`company/${user.company.id}/members`)
      .then(({data}) => {
        setMembersData({...membersData, fetched: true, fetching: false, data});
      })
      .catch(() => {
        setMembersData({...membersData, fetching: false});
      });
  };

  /**
   * Fetches product types from the backend.
   * @param {boolean} refresh - Whether to force refresh even if already fetched
   * @returns {Promise<void>}
   */
  const fetchProductTypes = (refresh = false) => {
    if (productTypesData.fetched && !refresh) return;
    return request()
      .get('/product-type-list')
      .then(({data}) => {
        setProductTypesData({...productTypesData, fetched: true, fetching: false, data});
      });
  };

  /**
   * Fetches staff size options from the backend.
   * @param {boolean} refresh - Whether to force refresh even if already fetched
   * @returns {Promise<void>}
   */
  const fetchStaffSizes = (refresh = false) => {
    if (staffSizeData.fetched && !refresh) return;
    return request()
      .get('/company-size-list')
      .then(({data}) => {
        setStaffSizeData({...staffSizeData, fetched: true, fetching: false, data});
      });
  };

  /**
   * Deletes a team member from the company.
   * @param {string|number} userId - ID of the user to remove
   */
  const deleteMember = (userId) => {
    setMembersData({...membersData, idBeingRemoved: userId});
    request(true)
      .post(`company/delete-members`, {
        'company-id': user.company.id,
        'user-ids': [userId],
      })
      .then(() => {
        fetchCompanyMembers(true);
      })
      .catch((e) => {
        console.error('Delete member failed', e);
      })
      .finally(() => {
        setMembersData({...membersData, idBeingRemoved: null});
      });
  };

  /**
   * Retrieves company details and stores them in state.
   * @returns {Promise<void>}
   */
  const getCompanyDetails = async () => {
    try {
      const {data: res} = await request(true).get(
        `/company/details/?company-id=${user.company.id}`
      );
      setCompanyDetails(res.company);
    } catch (error) {
    }
  };

  // Fetch company details when user is available
  useEffect(() => {
    user.company && getCompanyDetails();
  }, [user]);

  /**
   * Handle form submission
   * @param {Event} val
   * @return {undefined}
   */
  // Render settings page with tabbed interface and InviteMember modal
  return (
    <>
      <div className="padding-0 background-color-4">

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
          </div>
        </div>

        <div className="padding-y-24">
          <div className="background-color-white container-480 padding-0 box-shadow-small rounded-large">
            <div data-duration-in="300" data-duration-out="100" className="w-tabs">
              <div className="padding-x-10 border-bottom-1px flex-row-middle w-tab-menu">
                <a
                  data-w-tab="Account"
                  onClick={() => setTab(0)}
                  className={`tab-link w-inline-block w-tab-link ${tab === 0 && 'w--current'}`}
                >
                  <div className="text-small">Account</div>
                </a>
                <a
                  data-w-tab="Team"
                  onClick={() => setTab(1)}
                  className={`tab-link w-inline-block w-tab-link ${tab === 1 && 'w--current'}`}
                >
                  <div className="text-small">Team</div>
                </a>
                <a
                  data-w-tab="Company"
                  onClick={() => setTab(2)}
                  className={`tab-link w-inline-block w-tab-link ${tab === 2 && 'w--current'}`}
                >
                  <div className="text-small">Company</div>
                </a>
                <a
                  data-w-tab="Company"
                  onClick={() => setTab(3)}
                  className={`tab-link w-inline-block w-tab-link ${tab === 3 && 'w--current'}`}
                >
                  <div className="text-small">Brands</div>
                </a>
              </div>
              <div className="w-tab-content overflow-visible">
                {tab === 0 ? (
                  <Account />
                ) : tab === 1 ? (
                  <Team
                    showInviteModal={showInviteModal}
                    setShowInviteModal={(val) => setShowInviteModal(val)}
                    membersData={membersData}
                    fetchMembersHandler={fetchCompanyMembers}
                    deleteMemberHandler={deleteMember}
                  />
                ) : tab === 2 ? (
                  <Company
                    productTypesData={productTypesData}
                    staffSizeData={staffSizeData}
                    fetchProductTypesHandler={fetchProductTypes}
                    fetchStaffSizesHandler={fetchStaffSizes}
                  />
                ) : (
                  <Brands />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <InviteMember
        showInviteModal={showInviteModal}
        setShowInviteModal={(val) => setShowInviteModal(val)}
      />
    </>
  );
};

export default Settings;
