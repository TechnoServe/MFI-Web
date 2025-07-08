import React, {useState} from 'react';
import {useToast} from '@chakra-ui/react';
import {request} from 'common';
import Loader from 'components/circular-loader';
import {useAuth} from 'hooks/user-auth';
import {connect} from 'react-redux';
import {fetchAuthUserThunk} from 'store/action-types';
import PropTypes from 'prop-types';

/**
 * Account component allows users to update their full name and email.
 * It provides a form to edit account information and persists changes via API.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.fetchUser - Redux thunk to fetch the authenticated user's data
 * @returns {JSX.Element} Rendered form for updating user account details
 */
const Account = ({fetchUser}) => {
  // Chakra UI hook for displaying toast notifications
  const toast = useToast();
  // Access the currently authenticated user
  const {user} = useAuth();
  // Form state for user's full name and email
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  /**
   * Handles the save button click to update the user's full name and email.
   * Sends a PUT request to the backend and shows success or error toast.
   *
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>}
   */
  const saveChanges = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await request(true).put('me', {
        'full_name': fullName,
        'email': email,
      });
      fetchUser();
      setLoading(false);
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

  // Render form UI for updating user profile
  return (
    <div data-w-tab="Account" className="w-tab-pane w--tab-active">
      <div className="padding-x-10 padding-y-10 w-container">
        <div>
          <h4 className="text-align-left">Create company account</h4>
        </div>
        <div className="margin-top-10 margin-bottom-0 w-form">
          {/* Input field for full name */}
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          {/* Input field for full name */}
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
          {/* Input field for email */}
          <label htmlFor="email" className="form-label">
            Company Email
          </label>
          {/* Input field for email */}
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
            {/* Save button with loading indicator */}
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
