import React, {useState} from 'react';
import Account from './components/account';

/**
 * Settings component renders the settings page UI, allowing users
 * to interact with tabbed account management sections like Account settings.
 *
 * @component
 * @returns {JSX.Element} The settings page layout with tabs
 */
const Settings = () => {
  // State to manage currently selected tab (only Account tab for now)
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
                <a
                  data-w-tab="Account"
                  // Set active tab to Account when the tab link is clicked
                  onClick={() => setTab(0)}
                  className={`tab-link w-inline-block w-tab-link ${tab === 0 && 'w--current'}`}
                >
                  <div className="text-small">Account</div>
                </a>
              </div>
              <div className="w-tab-content overflow-visible">
                {/* Render the Account settings component in the tab content area */}
                <Account />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
