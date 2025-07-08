import React, {useState} from 'react';
import Account from './components/account';
// import Company from './components/company';
import SaTool from './components/SaTool';
import Team from './components/team';
import CompanyUsers from './components/companyUsers';
import Companies from './components/companies';

/**
 * Settings component provides the admin interface for managing various settings tabs
 * such as Account, Admin Team, Company Users, Companies, and SA Tool.
 * Tab state is managed via local state and controls which section is visible.
 *
 * @component
 * @returns {JSX.Element} The rendered settings page with dynamic tab switching.
 */
const Settings = () => {
  // Local state to track which settings tab is currently active
  const [tab, setTab] = useState(0);


  /**
   * Handle form submission
   * @param {Event} val
   * @return {undefined}
   */
  return (
    <>
      <div className="padding-0 background-color-4">
        <div className="padding-y-24">
          <div className="background-color-white container-480 padding-0 box-shadow-small rounded-large">
            <div data-duration-in="300" data-duration-out="100" className="w-tabs">
              <div className="padding-x-10 border-bottom-1px flex-row-middle w-tab-menu">
                {/* Tab link for switching between different settings views */}
                <a
                  data-w-tab="Account"
                  onClick={() => setTab(0)}
                  className={`tab-link w-inline-block w-tab-link ${tab === 0 && 'w--current'}`}
                >
                  <div className="text-small">Account</div>
                </a>
                {/* Tab link for switching between different settings views */}
                <a
                  data-w-tab="Admin Team"
                  onClick={() => setTab(1)}
                  className={`tab-link w-inline-block w-tab-link ${tab === 1 && 'w--current'}`}
                >
                  <div className="text-small">Team</div>
                </a>
                {/* Tab link for switching between different settings views */}
                <a
                  data-w-tab="Company Users"
                  onClick={() => setTab(2)}
                  className={`tab-link w-inline-block w-tab-link ${tab === 2 && 'w--current'}`}
                >
                  <div className="text-small">Users</div>
                </a>
                {/* Tab link for switching between different settings views */}
                <a
                  data-w-tab="Companies"
                  onClick={() => setTab(3)}
                  className={`tab-link w-inline-block w-tab-link ${tab === 3 && 'w--current'}`}
                >
                  <div className="text-small">Companies</div>
                </a>
                {/* Tab link for switching between different settings views */}
                <a
                  data-w-tab="Company"
                  onClick={() => setTab(4)}
                  className={`tab-link w-inline-block w-tab-link ${tab === 4 && 'w--current'}`}
                >
                  <div className="text-small">SA Tool</div>
                </a>
              </div>
              <div className="w-tab-content">
                {/* Render the appropriate settings component based on the selected tab index */}
                {tab === 0 ? (
                  <Account />
                ) : tab === 1 ? (
                  <Team
                  />
                ) : tab === 2 ? (
                  <CompanyUsers
                  />
                ) : tab === 3 ? (
                  <Companies
                  />
                ) : (
                  <SaTool />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
