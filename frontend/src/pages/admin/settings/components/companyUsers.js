import React, {useEffect, useState} from 'react';
import {useToast} from '@chakra-ui/react';
import {Text} from '@chakra-ui/layout';
import {
  Flex,
  Spinner
} from '@chakra-ui/react';
import {request} from 'common';

/**
 * CompanyUsers component displays a list of company users fetched from the backend.
 * Allows admin to remove users by triggering a delete request.
 *
 * @component
 * @returns {JSX.Element} Rendered list of users with removal functionality and loading state.
 */
const CompanyUsers = () => {
  // State to manage loading spinner visibility
  const [loading, setLoading] = useState(false);
  // Initialize Chakra UI toast for notifications
  const toast = useToast();
  // State to store company members fetched from the API
  const [companyMembers, setCompanyMembers] = useState([]);

  /**
   * Sends a DELETE request to remove a selected user from the company.
   *
   * @param {string|number} id - The user's ID
   * @param {string|number} authId - The user's auth provider ID
   * @returns {Promise<void>} Toast notification and page reload if successful
   */
  const removeSelectedMember = async (id, authId) => {
    const res = await request(true).delete(`admin/delete/user/${id}/${authId}/`);
    if (res.status === 200) {
      // Reload the page after 3 seconds to reflect changes
      setTimeout(() => {
        location.reload();
      }, 3000);
      return toast({
        status: 'success',
        title: 'success',
        position: 'top-right',
        description: `User deleted`,
        duration: 6000,
        isClosable: true,
      });
    } else {
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
    setLoading(true);
    // Fetch the list of company members from the API on component mount
    const fetchCompanyMembers = async () => {
      try {
        const data = await request(true).get(
          `admin/company/members`
        );
        // Set company member data and disable loading spinner
        setCompanyMembers(data);
        setLoading(false);
      } catch (error) {
        // In case of error, disable loading spinner
        setLoading(false);
      }
    }; fetchCompanyMembers();
  }, []);
  // Render loading spinner or list of company users
  return (
    <>
      <div data-w-tab="Team" className="w-tab-pane w--tab-active">
        <div className="padding-x-10 padding-y-10 w-container">
          <div className="flex-align-center flex-space-between margin-bottom-10">
            <Text className="text-align-left" fontSize="20px" fontWeight="700">
              Company Users
            </Text>
          </div>
          {loading ? (
            <Flex height="100%" width="100%" mb="10" justifyContent="center" alignItems="center">
              <Spinner />
            </Flex>
          ) :
            companyMembers?.data?.map((x) => (
              // Render user info and "Remove User" button for each company member
              <div key={x.id} className="border-bottom-1px">
                <div className="padding-4 flex-row-middle flex-space-between">
                  <div className="flex-row-middle">
                    <div>
                      <div className="text-base medium">{x.full_name}</div>
                      <div className="text-small weight-medium text-color-body-text">
                        {x.email}
                      </div>
                      <div className="text-small weight-medium text-color-body-text">
                        {x.company_name?x.company_name:'NO company Assigned'}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeSelectedMember(x?.user_id, x?.auth_provider_id)} className="button-secondary button-small w-button">Remove User</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};


export default CompanyUsers;
