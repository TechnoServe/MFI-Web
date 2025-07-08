import React, {Component} from 'react';
import Loader from 'components/circular-loader';
import validatejs from 'validate.js';
import {request} from 'common';
import {Link} from 'react-router-dom';
import logo from 'assets/mfilogo.png';
import ConfirmationFragment from 'components/confirmation-fragment';

/**
 * Page component for user login view.
 * Handles email input, validation, and form submission for login.
 *
 * @class
 * @extends React.Component
 */
class Page extends Component {
  /**
   * Initializes state for login success flag and form fields with validation rules.
   *
   * @param {*} props - React component props
   */
  constructor(props) {
    super(props);
    this.state = {
      login_successful: false,
      form: {
        loading: false,
        inputs: {
          email: {
            errors: [],
            rules: {
              presence: {
                allowEmpty: false,
                message: 'Your email address is required.',
              },
              email: {
                message: 'Provide a valid email address.',
              },
            },
          },
        },

        /**
         * Handles login form submission.
         * Validates input and sends login request to server.
         *
         * @param {Event} e - Form submit event
         * @returns {undefined}
         */
        submit(e) {
          if (e) e.preventDefault();
          let hasError = false;

          // Convert form data to a plain object
          const body = Object.fromEntries(new FormData(e.currentTarget).entries());

          // Validate each input field using its rules
          for (const key in body) {
            if (Object.hasOwnProperty.call(this.state.form.inputs, key)) {
              const value = body[key];
              const inputObj = this.state.form.inputs[key];
              const errs = validatejs.single(value, inputObj.rules);

              if (!errs || !errs?.length) continue;
              hasError = true;
              this.setState((state) => (state.form.inputs[key].errors = errs));
            } else {
              console.warn(`State form value with key ${key} does not exit.`);
            }
          }

          if (hasError) return;
          // Show loading spinner while sending login request
          this.setState((state) => (state.form.loading = true));
          request()
            .post('/login', body)
            .then(() => {
              this.setState((state) => (state.login_successful = true));
              e.target.reset();
            })
            .catch((err) => {
              if (err.response.status == 401) {
                this.setState(
                  (state) => (state.form.inputs['email'].errors = ['Invalid login credentials'])
                );
              }
            })
            .finally(() => this.setState((state) => (state.form.loading = false)));
        },
      },
    };
  }

  /**
   * Validates a single input field on blur event.
   *
   * @param {Event} e - Input blur event
   * @returns {undefined}
   */
  validateSingle(e) {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    if (!Object.prototype.hasOwnProperty.call(this.state.form.inputs, name)) {
      console.warn(`Input with key: "${name}" is not found`);
      return;
    }

    const inputObj = this.state.form.inputs[name];
    const errs = validatejs.single(value, inputObj.rules);

    // Clear previous validation errors
    this.setState((state) => (state.form.inputs[name].errors = [])); // Clear initial errors

    if (!errs || !errs?.length) return;

    this.setState((state) => (state.form.inputs[name].errors = errs));
  }

  /**
   * Renders the login form with email input and submit button.
   * Shows confirmation on successful login.
   *
   * @returns {JSX.Element} Login form layout or confirmation fragment
   */
  render() {
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
              {(this.state.login_successful && <ConfirmationFragment />) || (
                <>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold mb-3">Access your account</h4>
                    <p className="text-sm text-gray-800">
                      {/* If you need additional help in figuring out what info to put in here, check
                      out this short video */}
                    </p>
                  </div>
                  {/* Login form with MFI email input */}
                  <form onSubmit={this.state.form.submit.bind(this)}>
                    <div className="mt-10">
                      <div className="mb-2 text-sm">
                        <label htmlFor="email" className="form-label">
                          MFI Email
                        </label>
                      </div>
                      {/* Email input field with onBlur validation */}
                      <input
                        name="email"
                        className="form-control border-gray-300 focus:border-blue-600 form-input margin-bottom-4 w-input"
                        onBlur={this.validateSingle.bind(this)}
                      />
                      {/* Display validation error if present */}
                      <div className="mt-2 text-sm text-red-600">
                        {this.state.form.inputs['email'].errors[0]}
                      </div>
                    </div>
                    <div className="mt-7">
                      {/* Submit button that shows loader or "Submit" label */}
                      <button
                        className="btn w-full border-green-500 bg-green-500 focus:bg-green-700 focus:border-green-700  text-white"
                        type="submit"
                      >
                        {(this.state.form.loading && <Loader />) || <span>Submit</span>}
                      </button>
                    </div>
                    <div className="mt-7 text-center">
                      {/* Navigation link to sign-up page */}
                      <Link className="text-gray-500 text-sm hover:underline" to="/sign-up">
                        Sign Up (New Account)
                      </Link>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Page;
