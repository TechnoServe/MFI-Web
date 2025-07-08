import React, {useState} from 'react';
import {useToast, Text} from '@chakra-ui/react';
import {useAuth} from 'hooks/user-auth';
import {request} from 'common';
import Loader from 'components/circular-loader';
import accountLogo from '../../../../assets/images/accountLogo.png';
import accountUpload from '../../../../assets/images/accountUpload.png';

/**
 * Account component displays and allows users to edit their profile information (name and email).
 * Includes profile image section, input fields, and save button with loading state and toast feedback.
 *
 * @component
 * @returns {JSX.Element} A form interface for updating account settings.
 */
const Account = () => {
  // Initialize Chakra UI toast for notifications
  const toast = useToast();
  // Get authenticated user data from context
  const {user} = useAuth();
  // Initialize state for full name, email, and loading indicator
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);


  /**
   * Handles saving changes to the user's profile by sending an API request.
   *
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>} Displays a toast indicating success or failure.
   */
  const saveChanges = async (e) => {
    e.preventDefault();
    // Start loading and send update request
    setLoading(true);
    try {
      await request(true).put('/me', {fullName, email});
      // If successful, show a success toast
      setLoading(false);
      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: 'Works',
        duration: 6000,
        isClosable: true,
      });
    } catch (error) {
      // If an error occurs, show an error toast
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
    <div data-w-tab="Account" className="w-tab-pane w--tab-active">
      <div className="padding-x-10 padding-y-10 w-container">
        {/* Section title */}
        <Text className="text-align-left" fontSize="20px" fontWeight="700">
          Account Settings
        </Text>

        {/* Profile picture and upload icon (static display) */}
        <div className="margin-top-10">
          <div className="width-24 height-24 flex-column-centered margin-bottom-2">
            <img
              src={accountLogo}
              loading="lazy"
              alt=""
              className=" padding-bottom-1"
              width="90"
              height="90"
              style={{position: 'relative'}}
            />
            <img style={{position: 'absolute', marginTop: '74px', marginLeft: '51px'}} src={accountUpload} />
          </div>
        </div>


        <div className="margin-top-10 margin-bottom-0 w-form">
          {/* Form fields for editing full name and email address */}
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-input margin-bottom-4 w-input"
            maxLength="256"
            name="name"
            onChange={(e) => setFullName(e.target.value)}
            data-name="Name"
            placeholder="Omotola Adewale"
            id="name"
            value={fullName}
          />
          {/* Form fields for editing full name and email address */}
          <label htmlFor="email" className="form-label">
            Company Email
          </label>
          <input
            type="email"
            className="form-input w-input"
            maxLength="256"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            data-name="Email"
            placeholder="omotola@dangote.flour"
            id="email"
            required=""
            value={email}
          />
          <div className="margin-top-10">
            {/* Save button triggers the saveChanges function and displays loader if active */}
            <button
              onClick={saveChanges}
              className="button w-button"
              style={{outline: 'none', backgroundColor: '#ECECEF'}}
            >
              {(loading && <Loader />) || <span style={{color: '#9696A6'}}>Save changes</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
