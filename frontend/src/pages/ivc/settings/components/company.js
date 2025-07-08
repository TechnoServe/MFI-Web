import React, {useEffect, useState} from 'react';
import {useAuth} from 'hooks/user-auth';
import PropTypes from 'prop-types';
import {request} from 'common';
import {connect} from 'react-redux';
import {fetchAuthUserThunk} from 'store/action-types';
import {useToast} from '@chakra-ui/react';

/**
 * Company component provides a form for updating company details such as name,
 * email, and staff size. It uses authenticated user data and dispatches updates
 * via API calls. The email field is displayed but not editable.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.fetchProductTypesHandler - Fetches product type options (not used directly)
 * @param {Function} props.fetchStaffSizesHandler - Fetches available staff size options
 * @param {Object} props.staffSizeData - Contains loading state and data for staff sizes
 * @param {Function} props.fetchUser - Redux function to refresh authenticated user data
 * @returns {JSX.Element} Company settings form with editable name and staff size
 */
const Company = ({fetchProductTypesHandler, fetchStaffSizesHandler, staffSizeData, fetchUser}) => {
  // Chakra UI hook for displaying toast notifications
  const toast = useToast();
  // Get the currently authenticated user object
  const {user} = useAuth();
  const [saving, setSaving] = useState(false);
  // Initialize form data using user-provided company details
  const [formData, setFormData] = useState({
    company_name: user.company.company_name,
    company_email: user.email,
    company_size: user.company.company_size,
  });

  // Fetch initial data for product types and staff sizes when component mounts
  useEffect(() => {
    fetchProductTypesHandler();
    fetchStaffSizesHandler();
  }, []);

  /**
   * Handles updates to form input fields
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event
   */
  const setFormField = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    // Update form field only if it exists in the formData object
    if (typeof formData[fieldName] !== 'undefined') {
      setFormData({
        ...formData,
        [fieldName]: fieldValue,
      });
    }
  };

  /**
   * Handles form submission to update company data on the backend
   *
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>}
   */
  const submitCompanyData = async (e) => {
    // Prevent multiple submissions
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      // Make POST request to update company info
      await request(true).post('company/edit', {
        'company-id': user.company.id,
        'name': formData.company_name,
        'company-size-id': formData.company_size,
        'product-type-id': formData.product_type,
      });
      // Refresh user data and show success toast
      fetchUser();
      setSaving(false);
      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: 'Company updated',
        duration: 6000,
        isClosable: true,
      });
    } catch (error) {
      // Handle error and display error toast
      setSaving(false);
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
    <div data-w-tab="Company" className="w-tab-pane w--tab-active">
      <div className="padding-x-10 padding-y-10 w-container">
        <div>
          <h4 className="text-align-left">Update company details</h4>
        </div>
        <div className="margin-top-10">
          <div className="width-24 height-24 border-1px background-secondary rounded-full flex-column-middle flex-column-centered margin-bottom-2">
            <img
              src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg"
              loading="lazy"
              alt=""
              className="width-6 padding-bottom-1"
            />
            <div className="text-small">Upload</div>
          </div>
          <div className="text-small">Upload your company&#x27;s Logo</div>
        </div>
        <div className="margin-top-10 margin-bottom-0 w-form">
          <form
            id="wf-form-PC---Create-company-account"
            name="wf-form-PC---Create-company-account"
            onSubmit={submitCompanyData}
          >
            {/* Input field for company name */}
            <label htmlFor="name-2" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              className="form-input margin-bottom-4 w-input"
              maxLength="256"
              name="company_name"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={setFormField}
              id="name-2"
            />
            {/* Input field for company email (disabled) */}
            <label htmlFor="email-2" className="form-label">
              Company Email
            </label>
            <input
              type="email"
              className="form-input w-input"
              maxLength="256"
              placeholder="email@company.example.com"
              name="company_email"
              disabled={true}
              value={formData.company_email}
              onChange={setFormField}
              id="email-2"
              required=""
            />
            {/* Dropdown for staff size selection */}
            <label htmlFor="email-3" className="form-label">
              Staff Size
            </label>
            <select
              id="field"
              name="company_size"
              className="form-select margin-bottom-4 w-select"
              value={formData.company_size}
              onChange={setFormField}
            >
              {staffSizeData.data.map((item) => (
                <option key={item.id} value={item.id}>{ item.name }</option>
              ))}
            </select>
            {/* Submit button */}
            <div className="margin-top-10">
              <input
                type="submit"
                disabled={saving}
                value={saving ? 'Please wait...' : 'Save changes'}
                className="button width-full w-button"
              />
            </div>
          </form>
          <div className="success-message w-form-done">
            <div className="text-block">Thank you! Your submission has been received!</div>
          </div>
          <div className="w-form-fail">
            <div>Oops! Something went wrong while submitting the form.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

Company.propTypes = {
  staffSizeData: PropTypes.shape({
    fetching: PropTypes.bool,
    fetched: PropTypes.bool,
    data: PropTypes.array,
  }),
  fetchProductTypesHandler: PropTypes.func,
  fetchStaffSizesHandler: PropTypes.func,
  fetchUser: PropTypes.func,
};

export default connect(undefined, (dispatch) => ({
  fetchUser: () => dispatch(fetchAuthUserThunk()),
}))(Company);
