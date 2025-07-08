import {nanoid} from '@reduxjs/toolkit';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Text} from '@chakra-ui/react';
import Loader from 'components/circular-loader';

/**
 * Team component displays a list of company team members and allows inviting or removing members.
 * It fetches team data, displays avatars and metadata, and provides confirmation modals for removal.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.showInviteModal - Controls visibility of the invite modal
 * @param {Function} props.setShowInviteModal - Function to toggle invite modal visibility
 * @param {Function} props.fetchMembersHandler - Function to fetch members from backend
 * @param {Function} props.deleteMemberHandler - Function to delete a member by ID
 * @param {Object} props.membersData - Object containing team data and UI states
 * @param {boolean} props.membersData.fetching - Indicates loading state
 * @param {boolean} props.membersData.fetched - Indicates fetch completion
 * @param {string} props.membersData.idBeingRemoved - ID of member currently being removed
 * @param {Array} props.membersData.data - Array of team member objects
 * @returns {JSX.Element} Rendered team management section with invite and removal functionality
 */
const Team = ({
  showInviteModal,
  setShowInviteModal,
  fetchMembersHandler,
  membersData,
  deleteMemberHandler,
}) => {
  const [show, setShow] = useState(false);

  // Fetch the list of team members when the component mounts
  useEffect(() => {
    fetchMembersHandler();
  }, []);

  // Auto-close removal confirmation modal when deletion completes
  useEffect(() => {
    if (show && membersData.idBeingRemoved == null) {
      setShow(!show);
    }
  }, [membersData]);

  return (
    <>
      <div data-w-tab="Team" className="w-tab-pane w--tab-active">
        <div className="padding-x-10 padding-y-10 w-container">
          <div className="flex-align-center flex-space-between margin-bottom-10">
            <Text className="text-align-left" fontSize="20px" fontWeight="700">
              Team members
            </Text>
            {/* Toggle the visibility of the invite modal */}
            <a
              data-w-id="a79b7997-519c-1332-bf20-d87feb8c2e16"
              onClick={() => setShowInviteModal(!showInviteModal)}
              className="button-secondary button-small w-button"
            >
              Invite
            </a>
          </div>
          {/* Show loading spinner while team members are being fetched */}
          {membersData.fetching ? <Loader /> : null}
          {/* Loop through and render each team member's card */}
          {membersData.data.map((member) => (
            <div key={nanoid()} className="w-layout-grid grid-list box-shadow-small rounded-large">
              <div className="padding-4 flex-row-middle flex-space-between border-bottom-1px">
                <div className="flex-row-middle">
                  {/* Display avatar using the member's full name */}
                  <img
                    src={`https://ui-avatars.com/api/?background=random&name=${member.full_name}`}
                    loading="lazy"
                    alt=""
                    className="width-9 height-9 rounded-full margin-right-4"
                  />
                  <div>
                    {/* Display member full name */}
                    <div className="text-base medium">{member.full_name}</div>
                    {/* Display the company name the member belongs to */}
                    <div className="text-small weight-medium text-color-body-text">
                      {member.company.company_name}
                    </div>
                  </div>
                </div>
                {/* Removal confirmation modal */}
                <div
                  data-w-id="96da7984-2260-4962-0d48-c3b889abade4"
                  className={`background-color-white border-1px padding-top-4 box-shadow-large rounded-large width-80 remove-dropdown ${show ? '' : 'hide'
                  }`}
                >
                  <h6 className="padding-left-4">Are you sure?</h6>
                  <div className="text-small margin-bottom-4 padding-left-4">
                    {member.full_name} won’t have any access to this project unless you invite them
                    again.
                  </div>
                  <div className="flex-row flex-space-between">
                    <div className="padding-y-3 padding-x-4 flex-justify-end background-secondary">
                      {/* Cancel button to close the confirmation dropdown */}
                      <a
                        onClick={() => setShow(!show)}
                        className="button-primary button-small w-button"
                      >
                        Cancel
                      </a>
                    </div>
                    <div className="padding-y-3 padding-x-4 flex-justify-end background-secondary">
                      {membersData.idBeingRemoved === member.id ? (
                        <Loader />
                      ) : (
                        // Confirm removal button triggers deletion logic
                        <a
                          onClick={(event) => {
                            event.preventDefault();
                            deleteMemberHandler(member.id);
                          }}
                          href="#!"
                          className="button-danger button-small w-button"
                        >
                          Confirm remove
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                {/* Toggle to show the 'Remove' dropdown */}
                <div
                  onClick={() => setShow(!show)}
                  data-w-id="1e597d38-b4f2-e776-75f8-6acc3c20f7bc"
                  style={{cursor: 'pointer'}}
                  className="button-text padding-x-3 padding-y-1 "
                >
                  Remove
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

Team.propTypes = {
  setShowInviteModal: PropTypes.any,
  showInviteModal: PropTypes.bool,
  fetchMembersHandler: PropTypes.func,
  deleteMemberHandler: PropTypes.func,
  membersData: PropTypes.shape({
    fetching: PropTypes.bool,
    fetched: PropTypes.bool,
    idBeingRemoved: PropTypes.string,
    data: PropTypes.array,
  }),
};

export default Team;
