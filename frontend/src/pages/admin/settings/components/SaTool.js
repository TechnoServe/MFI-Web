import React, {useEffect, useState} from 'react';
import {useToast, Text} from '@chakra-ui/react';
import {useAuth} from 'hooks/user-auth';
import {request} from 'common';
import Loader from 'components/circular-loader';

/**
 * SaTool component allows admin users to configure settings for the Self Assessment Tool (SAT),
 * specifically to set a lock date for the current assessment cycle.
 * It fetches the active cycle on mount and allows date submission via API.
 *
 * @component
 * @returns {JSX.Element} A form interface to set the SAT lock date
 */
const SaTool = () => {
  // Get authenticated user details from context
  const {user} = useAuth();
  // Initialize toast notifications from Chakra UI
  const toast = useToast();
  // State for managing loading spinner visibility
  const [loading, setLoading] = useState(false);
  // State for storing the selected lock date
  const [lockDate, setLockDate] = useState();
  // State to hold the currently active assessment cycle
  const [activeCycle, setActiveCycle] = useState({});

  useEffect(() => {
    // Fetch active SAT cycle when component mounts
    setLoading(true);
    const fetchCurrentCycle = async () => {
      // Request current active cycle and update state
      try {
        const data = await request(true).get(
          `admin/active-cycle`
        );
        setActiveCycle(data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }; fetchCurrentCycle();
  }, []);

  /**
   * Handles form submission to save the SAT lock date.
   *
   * @param {React.FormEvent} e - Form submission event
   * @returns {Promise<void>} Toast feedback based on success or error
   */
  const saveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await request(true).put('admin/lock-sat', {
        'cycle-id': activeCycle.id,
        'date': lockDate
      });
      setLoading(false);
      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: 'Cycle Upldated',
        duration: 6000,
        isClosable: true,
      });
    } catch (error) {
      setLoading(false);
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

  return (
    <>
      {/* Render form UI for setting the SAT lock date and save button */}
      <div data-w-tab="SaTool" className="w-tab-pane w--tab-active">
        <div className="padding-x-10 padding-y-10 w-container">
          <Text className="text-align-left" fontSize="20px" fontWeight="700">
            Self Assessment Tool Settings
          </Text>

          <div className="margin-top-10 margin-bottom-0 w-form">
            <div className="text-small weight-medium text-color-body-text" style={{paddingBottom: '15px'}}>
              Lock date
            </div>
            {/* Input for selecting lock date (disabled for basic/super admins) */}
            <input
              onChange={(e) => setLockDate(e.target.value)}
              type="date"
              className="form-input margin-bottom-4 w-input"
              maxLength="256"
              name="lockDate"
              data-name="lockDate"
              id="lockDate"
              disabled={user.admin_user.role.value === 'basic_admin' || user.admin_user.role.value === 'super_admin'}
            />
            <div className="text-small weight-medium text-color-body-text">
              Set the lock date for the 2021 SA Tool cycle.
            </div>
            <div className="margin-top-10">
              {/* Button to trigger saving lock date */}
              <button
                onClick={saveChanges}
                className="button w-button"
                style={{outline: 'none', backgroundColor: '#ECECEF', color: '#9696A6'}}
              >
                {(loading && <Loader />) || <span style={{color: '#9696A6'}}>Save changes</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaTool;
