import React, {useEffect, useState} from 'react';
// import teamImg from 'assets/images/Team member name 2.svg';
import {Text} from '@chakra-ui/layout';
import EditProfile from '../../settings/EditProfile';
import InviteMember from './inviteMember';
import {
  Flex,
  Spinner
} from '@chakra-ui/react';
import {request} from 'common';

/**
 * Team component displays a list of admin team members for the platform.
 * It fetches team member data from the backend and renders user details with an edit option.
 *
 * @component
 * @returns {JSX.Element} A panel showing admin members with roles and company assignments.
 */
const Team = () => {
  // State to manage the loading spinner while fetching team data
  const [loading, setLoading] = useState(false);

  // State to store the list of fetched admin team members
  const [adminMembers, setAdminMembers] = useState([]);

  useEffect(() => {
    // Fetch admin members from the backend on component mount
    setLoading(true);
    const fetchAdminMembers = async () => {
      try {
        const data = await request(true).get(
          `admin/members`
        );
        // Set the retrieved admin members to state and disable loading
        setAdminMembers(data);
        setLoading(false);
      } catch (error) {
        // Disable loading if request fails
        setLoading(false);
      }
    }; fetchAdminMembers();
  }, []);
  return (
    <>
      <div data-w-tab="Team" className="w-tab-pane w--tab-active">
        <div className="padding-x-10 padding-y-10 w-container">
          <div className="flex-align-center flex-space-between margin-bottom-10">
            <Text className="text-align-left" fontSize="20px" fontWeight="700">
              Team Members
            </Text>
            {/* Button component for inviting new team members */}
            <InviteMember />
          </div>
          {loading ? (
            <Flex height="100%" width="100%" mb="10" justifyContent="center" alignItems="center">
              <Spinner />
            </Flex>
          ) :
            // Render each admin member's profile, role label, and assigned company count
            adminMembers?.data?.map((x) => (
              <div key={x.id} className="border-bottom-1px">
                <div className="padding-4 flex-row-middle flex-space-between">
                  <div className="flex-row-middle">
                    <img src="https://assets.website-files.com/60772f4527bb4e6ff9bf7f7d/6088137dc77d256e4e541759_Team%20member%20name.png" loading="lazy" alt="" className="width-9 height-9 rounded-full margin-right-4" />
                    <div>
                      <div className="text-base medium">{x.full_name}</div>
                      <div className="text-small weight-medium text-color-body-text">

                        {/* Display human-readable role name based on role ID */}
                        {
                          x.role === 'F4UNfg4iRCZRKJGZpbvv' ? 'Super Admin'
                            : x.role === 'l9SHXn44ldl0reoeRqlQ' ? 'Independent Validated Consultant'
                              : x.role === 'sHM61QwGajJMNUPYxTVI' ? 'Nuclear Admin'
                                : x.role === 'zgDkefjf2EOLxVhH2Hc8' ? 'Basic Admin'
                                  : 'No Role Assigned'

                        }
                      </div>
                    </div>
                  </div>
                  {/* Component for editing the selected admin member's profile */}
                  <EditProfile profileData={x} />
                </div>
                {/* Display the number of companies assigned to the team member */}
                <div className="padding-x-4 padding-bottom-4 padding-top-1 flex-row-middle flex-space-between">
                  <div className="category-header">
                    {x?.companies === null ? 0 : x?.companies?.length} ASSIGNED COMPANIES</div>
                  <img src="https://assets.website-files.com/60772f4527bb4e6ff9bf7f7d/611e46b9c7bda0a185d74d92_Assigned%20Companies.svg" loading="lazy" alt="" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};


export default Team;
