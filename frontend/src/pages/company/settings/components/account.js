import React, {useState} from 'react';
import {useToast, Text} from '@chakra-ui/react';
import {request} from 'common';
import Loader from 'components/circular-loader';
import {useAuth} from 'hooks/user-auth';
import {connect} from 'react-redux';
import {fetchAuthUserThunk} from 'store/action-types';
import PropTypes from 'prop-types';

/**
 * Account component allows a user to update their full name and email.
 * It handles form input, validation, API request, and feedback via toast notifications.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.fetchUser - Redux action to fetch the authenticated user details
 * @returns {JSX.Element} A form interface to update account settings
 */
const Account = ({fetchUser}) => {
  const toast = useToast();
  const {user} = useAuth();
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  /**
   * Handles submission of updated full name and email.
   * Sends a PUT request to the server and displays a success or error toast.
   *
   * @param {Event} e - Form submission event
   * @returns {Promise<void>}
   */
  const saveChanges = async (e) => {
    e.preventDefault();
    // Prevent multiple submissions while loading
    if (loading) return;
    setLoading(true);
    try {
      // Send updated full name and email to the server
      await request(true).put('me', {
        full_name: fullName,
        email: email,
      });
      // Refresh the authenticated user info from the Redux store
      fetchUser();
      setLoading(false);
      // Show feedback toast message based on outcome
      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: 'Account updated',
        duration: 6000,
        isClosable: true,
      });
    } catch (error) {
      setLoading(false);
      // Show feedback toast message based on outcome
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
    <div data-w-tab="Account" className="w-tab-pane w--tab-active">
      <div className="padding-x-10 padding-y-10 w-container">
        <Text className="text-align-left" fontSize="20px" fontWeight="700">
          Create company account
        </Text>
        <div className="margin-top-10 margin-bottom-0 w-form">
          {/* Full name input field */}
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          {/* Full name input field */}
          <input
            type="text"
            className="form-input margin-bottom-4 w-input"
            maxLength="256"
            name="name"
            onChange={(e) => setFullName(e.target.value)}
            data-name="Name"
            placeholder="Full Name"
            value={fullName}
            id="name"
          />
          {/* Email input field */}
          <label htmlFor="email" className="form-label">
            Company Email
          </label>
          {/* Email input field */}
          <input
            type="email"
            className="form-input w-input"
            maxLength="256"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            data-name="Email"
            placeholder="email@example.com"
            value={email}
            id="email"
            required=""
          />
          <div className="margin-top-10">
            {/* Submit button to save changes */}
            <button
              onClick={saveChanges}
              className="button width-full w-button"
              style={{outline: 'none'}}
            >
              {(loading && <Loader />) || <span>Save changes</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Account.propTypes = {
  fetchUser: PropTypes.func,
};

export default connect(undefined, (dispatch) => ({
  fetchUser: () => dispatch(fetchAuthUserThunk()),
}))(Account);
