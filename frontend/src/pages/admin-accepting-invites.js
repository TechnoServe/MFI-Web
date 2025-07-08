import React, {useState} from 'react';
import Loader from 'components/circular-loader';
import logo from 'assets/images/logo.svg';
import ConfirmationFragment from 'components/confirmation-fragment';
import {request} from 'common';
import {useParams} from 'react-router-dom';
import validatejs from 'validate.js';
import {useToast} from '@chakra-ui/react';
import {getApiResponseErrorMessage} from 'utills/helpers';

/**
 * AdminsAcceptingInvite renders a form allowing invited admin users
 * to set up their profile by entering their full name.
 * It submits the name along with an invitation token to complete signup.
 *
 * @component
 * @returns {JSX.Element} Signup form UI for accepting admin invitation
 */
const AdminsAcceptingInvite = () => {
  // State to manage loading state while submitting the form
  const [loading, setLoading] = useState(false);
  // State to store the full name entered by the user
  const [fullName, setFullName] = useState('');
  // State to hold validation error for the full name input
  const [fullNameError, setFullNameError] = useState('');
  // State to indicate whether login/signup was successful (currently unused)
  const [loginSuccessful] = useState(false);
  // Extract the invitation token from the route parameters
  const {token: invitationId} = useParams();
  // Hook to trigger toast notifications
  const toast = useToast();

  /**
   * Validates the full name field to ensure it's not empty.
   *
   * @returns {boolean} True if valid, false otherwise
   */
  const validateForm = () => {
    setFullNameError(null);
    const errors = validatejs.single(fullName, {
      presence: {
        allowEmpty: false,
        message: 'Your full name is required.',
      },
    });

    if (errors && errors.length) {
      setFullNameError(errors[0]);
      return false;
    }

    return true;
  };

  /**
   * Handles form submission by sending full name and invitation ID to API.
   *
   * @param {React.FormEvent} e - Form submission event
   * @returns {Promise<void>}
   */
  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await request().post('admin/accept-invitation', {
        fullName,
        invitationId,
      });
      toast({
        status: 'success',
        title: 'Sign up successful',
        position: 'bottom-right',
        description: 'Please check your email for your login link',
        duration: 6000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        status: 'error',
        title: 'Error',
        position: 'bottom-right',
        description: getApiResponseErrorMessage(
          e?.response?.data,
          'Request not completed. Please try again'
        ),
        duration: 6000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  // Render the signup form UI or confirmation fragment if already logged in
  return (
    <section id="entry-page" className="relative">
      <div className="navbar bg-white z-50">
        <div className="container mx-auto">
          <img src={logo} alt="logo" className="h-9" />
        </div>
      </div>
      <div className="min-h-screen grid items-center">
        <div className="container mx-auto">
          <div className="container-480 md:w-2/4 py-24 mx-auto">
            {(loginSuccessful && <ConfirmationFragment />) || (
              <>
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-3">Setup your profile</h4>
                  <p className="text-sm text-gray-800">
                    You have been invited by @Joseph Guchi to this space. Kindly fill in your
                    details to get started
                  </p>
                </div>
                <form onSubmit={submit}>
                  <fieldset disabled={loading}></fieldset>
                  <div className="mt-10">
                    {/* Input field for full name */}
                    <div className="mb-2 text-sm">
                      <label htmlFor="email" className="form-label">
                        Full Name
                      </label>
                    </div>
                    <input
                      name="fullName"
                      className="form-control border-gray-300 focus:border-blue-600 form-input margin-bottom-4 w-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={validateForm}
                    />
                    {/* Show validation error message */}
                    <div className="mt-2 text-sm text-red-600">{fullNameError}</div>
                  </div>
                  <div className="mt-7">
                    {/* Submit button that displays loader or "Get Started" text */}
                    <button
                      className="btn w-full border-green-500 bg-green-500 focus:bg-green-700 focus:border-green-700  text-white"
                      type="submit"
                    >
                      {(loading && <Loader />) || <span>Get Started</span>}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminsAcceptingInvite;
