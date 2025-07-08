import React, {Component} from 'react';
import ConfirmationFragment from 'components/confirmation-fragment';
import Loader from 'components/circular-loader';
import validatejs from 'validate.js';
import {request} from 'common';
import {Link} from 'react-router-dom';
import logo from 'assets/mfilogo.png';

/**
 * Custom validator to validate an array of brand objects.
 * Ensures each brand has a name and a valid product type.
 *
 * @param {Array<Object>} brands - Array of brand objects
 * @param {Object} options - Options including valid product type IDs
 * @returns {Array|null} Array of error messages per brand, or null if valid
 */
validatejs.validators['company-brands'] = function (brands, options) {
  const productTypeIds = options['product-type-ids'];
  // Collect validation errors for each brand
  let allErrors = [];

  allErrors = brands.reduce((errors, brand, index) => {
    const errs = [];

    if (!brand.name || brand.name === '') {
      errs.push('Brand name can not be empty.');
    }

    if (!brand['product-type'] || brand['product-type'] === '') {
      errs.push('Brand product type can not be empty.');
    }

    if (productTypeIds.every((id) => id !== brand['product-type'])) {
      errs.push('The provided product type is not valid.');
    }

    if (errs.length) errors[index] = errs;

    return errors;
  }, []);

  return allErrors?.length ? allErrors : null;
};

/**
 * Login page component
 */
class Page extends Component {
  /**
   * Page component constructor to initialize state and form structure.
   *
   * @param {*} props - React component props
   */
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      registration_successful: false,
      loading_data: true,
      company_size_list: [],
      product_type_list: [],
      form: {
        loading: false,
        inputs: {
          'full-name': {
            page: 1,
            errors: [],
            rules: {
              presence: {
                allowEmpty: false,
                message: 'Your full name is required.',
              },
            },
          },
          'company-email': {
            page: 1,
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
          'company-name': {
            page: 1,
            errors: [],
            rules: {
              presence: {
                allowEmpty: false,
                message: 'The company name is required.',
              },
            },
          },
          'company-size': {
            page: 1,
            errors: [],
            rules: {
              presence: {
                allowEmpty: false,
                message: 'The company size is required.',
              },
            },
          },
          'brands': {
            page: 2,
            errors: [],
            rules: {
              'company-brands': {
                'product-type-ids': [],
              },
            },
            value: [
              {
                'name': '',
                'product-type': '',
              },
            ],
          },
        },

        /**
         * Handle form submission.
         * Validates inputs and posts data to the server.
         *
         * @param {Event} e - Form submit event
         * @returns {undefined}
         */
        submit(e) {
          // Prevent default form submission
          if (e) e.preventDefault();
          let hasError = false;
          const body = {};

          // Validate each input in the form
          for (const key in this.state.form.inputs) {
            if (Object.hasOwnProperty.call(this.state.form.inputs, key)) {
              const value = this.state.form.inputs[key].value;
              const inputObj = this.state.form.inputs[key];

              const errs = validatejs.single(value, inputObj.rules);
              body[key] = value;

              if (errs || errs?.length) {
                hasError = true;

                // Show errors only on the current page
                if (inputObj.page == this.state.page) {
                  this.setState((state) => (state.form.inputs[key].errors = errs));
                }
              }
            } else {
              console.warn(`State form value with key ${key} does not exit.`);
            }
          }

          // If not yet on the last page, go to next page
          if (this.state.page < 2) {
            this.setState((state) => state.page++);
            return;
          }

          // If there are validation errors, do not submit
          if (hasError) return;

          // Indicate loading state
          this.setState((state) => (state.form.loading = true));

          // Submit form data to the server
          request()
            .post('/sign-up', body)
            .then(() => {
              this.setState((state) => (state.registration_successful = true));
              e.target.reset();
            })
            .catch((err) => {
              if (err.response.status == 400) {
                const {errors} = err.response.data;
                for (const key in errors) {
                  if (Object.hasOwnProperty.call(errors, key)) {
                    this.setState((state) => (state.form.inputs[key].errors = errors[key]));
                  }
                }
              }
            })
            .finally(() => this.setState((state) => (state.form.loading = false)));
        },
      },
    };
  }

  /**
   * Fetch product type list from the server.
   *
   * @returns {Promise<any>} Promise resolving to list of product types
   */
  fetchProductTypesList() {
    // Make GET request to fetch product types
    return request()
      .get('/product-type-list')
      .then(({data: list}) => {
        this.setState({...this.state, product_type_list: list});
        return list;
      });
  }

  /**
   * Fetch company size list from the server.
   *
   * @returns {Promise<any>} Promise resolving to list of company sizes
   */
  fetchCompanySizeList() {
    // Make GET request to fetch company sizes
    return request()
      .get('/company-size-list')
      .then(({data: list}) => {
        return this.setState({...this.state, company_size_list: list});
      });
  }

  /**
   * Adds a blank brand entry to the form.
   *
   * @param {Event} e - Button click event
   * @returns {void}
   */
  addBrand(e) {
    if (e) e.preventDefault();
    // Add a new blank brand to the brands array in state
    this.setState((state) => state.form.inputs.brands.value.push({'name': '', 'product-type': ''}));
  }

  /**
   * Deletes a brand at the given index.
   *
   * @param {number} index - Index of brand to delete
   * @returns {void}
   */
  deleteBrand(index) {
    // Remove brand at index from brands array in state
    this.setState((state) => state.form.inputs.brands.value.splice(index, 1));
  }

  /**
   * Updates brand name value based on user input.
   *
   * @param {Event} e - Input event
   * @returns {void}
   */
  setBrandName(e) {
    e.preventDefault();
    const index = e.target.dataset['index'];
    const value = e.target.value;
    // Update brand name at given index
    this.setState((state) => (state.form.inputs.brands.value[index]['name'] = value));
  }

  /**
   * Updates form input values and triggers single validation.
   *
   * @param {Event} e - Input event
   * @returns {void}
   */
  handleFormInput(e) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    // Update value in form state
    this.setState((state) => (state.form.inputs[name].value = value));
    // Validate this input
    this.validateSingle(e);
  }

  /**
   * Updates the product type for a brand.
   *
   * @param {Event} e - Change event
   * @returns {void}
   */
  setBrandProductType(e) {
    e.preventDefault();
    const index = e.target.dataset['index'];
    const value = e.target.value;
    // Update product type at given brand index
    this.setState((state) => (state.form.inputs.brands.value[index]['product-type'] = value));
  }

  /**
   * React lifecycle method to fetch initial data after component mounts.
   *
   * @returns {void}
   */
  componentDidMount() {
    // Fetch required page data on mount
    this.setState({...this.state, loading_data: true});
    Promise.all([this.fetchCompanySizeList(), this.fetchProductTypesList()]).then((all) => {
      this.setState((state) => {
        const s = {...state};
        s.loading_data = false;
        // Set valid product type IDs for brand validation
        s.form.inputs['brands'].rules['company-brands']['product-type-ids'] = all[1].map(
          ({id}) => id
        );

        return s;
      });
    });
  }

  /**
   * Validates a single form input and updates the error state.
   *
   * @param {Event} e - Input event
   * @returns {void}
   */
  validateSingle(e) {
    const key = e.currentTarget.name;
    const value = e.currentTarget.value;

    // Check input exists in form state
    if (!Object.prototype.hasOwnProperty.call(this.state.form.inputs, key)) {
      console.warn(`Input with key: "${key}" is not found`);
      return;
    }

    const inputObj = this.state.form.inputs[key];
    const errs = validatejs.single(value, inputObj.rules);

    // Clear previous errors
    this.setState((state) => (state.form.inputs[key].errors = []));

    if (!errs || !errs?.length) return;

    // Set new errors if any
    this.setState((state) => (state.form.inputs[key].errors = errs));
  }

  /**
   * Render the sign-up form UI.
   *
   * @returns {JSX.Element} Rendered component
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
          {(this.state.loading_data && (
            <div className="text-center">
              <Loader color="#10b981" />
              <div className="mt-5">Loading...</div>
            </div>
          )) || (
            <div className="container mx-auto">
              <div className="container-480 md:w-2/4 py-24 mx-auto">
                {(this.state.registration_successful && <ConfirmationFragment />) || (
                  <>
                    <div className="text-center">
                      {(() => {
                        switch (this.state.page) {
                          case 1:
                            return (
                              <>
                                <h4 className="text-2xl font-bold mb-3">Create company account</h4>
                                <p className="text-sm text-gray-800">
                                  {/* If you need additional help in figuring out what info to put in
                                  here, check out this short video */}
                                </p>
                              </>
                            );
                          case 2:
                            return (
                              <>
                                <h4 className="text-2xl font-bold mb-3">Add your brands</h4>
                                <p className="text-sm text-gray-800">
                                    MFI will conduct regular product testing for each of your brands.
                                    Define your brands below to get accurate data on it&apos;s
                                    performance over time.
                                </p>
                              </>
                            );
                          default:
                            break;
                        }
                      })()}
                    </div>
                    <form onSubmit={this.state.form.submit.bind(this)} className="mt-10">
                      <div disabled={this.state.form.loading}>
                        {(() => {
                          switch (this.state.page) {
                            case 1:
                              return (
                                <>
                                  <div>
                                    <div className="mb-2 text-sm">
                                      <label htmlFor="full-name" className="form-label">
                                          Your Full Name
                                      </label>
                                    </div>
                                    <input
                                      name="full-name"
                                      className="form-control border-gray-300 focus:border-blue-600 form-input margin-bottom-4 w-input"
                                      defaultValue={this.state.form.inputs['full-name'].value}
                                      onInput={this.handleFormInput.bind(this)}
                                    />
                                    <div className="mt-2 mb-3 text-sm text-red-600">
                                      {this.state.form.inputs['full-name'].errors[0]}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="mb-2 text-sm">
                                      <label htmlFor="company-email" className="form-label">
                                          Company Email
                                      </label>
                                    </div>
                                    <input
                                      name="company-email"
                                      className="form-control border-gray-300 focus:border-blue-600 form-input margin-bottom-4 w-input"
                                      defaultValue={this.state.form.inputs['company-email'].value}
                                      onInput={this.handleFormInput.bind(this)}
                                    />
                                    <div className="mt-2 mb-3 text-sm text-red-600">
                                      {this.state.form.inputs['company-email'].errors[0]}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="mb-2 text-sm">
                                      <label htmlFor="company-name" className="form-label">
                                          Company Name
                                      </label>
                                    </div>
                                    <input
                                      name="company-name"
                                      className="form-control border-gray-300 focus:border-blue-600 form-input margin-bottom-4 w-input"
                                      defaultValue={this.state.form.inputs['company-name'].value}
                                      onInput={this.handleFormInput.bind(this)}
                                    />
                                    <div className="mt-2 mb-3 text-sm text-red-600">
                                      {this.state.form.inputs['company-name'].errors[0]}
                                    </div>
                                  </div>
                                  <div className="">
                                    <div className="mb-2 text-sm">
                                      <label htmlFor="company-size" className="form-label">
                                          Company Size
                                      </label>
                                    </div>
                                    <select
                                      name="company-size"
                                      className="form-control border-gray-300 focus:border-blue-600 form-select margin-bottom-4 w-select"
                                      onInput={this.handleFormInput.bind(this)}
                                      value={this.state.form.inputs['company-size'].value}
                                    >
                                      <option>Choose a size</option>
                                      {this.state.company_size_list.map((i) => (
                                        <option key={i.id} value={i.id}>
                                          {i.name}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="mt-2 mb-3 text-sm text-red-600">
                                      {this.state.form.inputs['company-size'].errors[0]}
                                    </div>
                                  </div>
                                  <div className="mt-5">
                                    <button
                                      className="btn w-full border-green-500 bg-green-500 focus:bg-green-700 focus:border-green-700  text-white"
                                      type="submit"
                                    >
                                      <span>Next Step</span>
                                    </button>
                                  </div>
                                  <div className="mt-5 text-center">
                                    <Link
                                      className="text-gray-500 text-sm hover:underline"
                                      to="/login"
                                    >
                                        Login (Existing Account)
                                    </Link>
                                  </div>
                                </>
                              );
                            case 2:
                              return (
                                <>
                                  {this.state.form.inputs.brands.value.map((brand, index) => (
                                    <div key={index}>
                                      <div style={{display: 'flex'}}>
                                        <div style={{flex: 1}} className="grid grid-cols-2 gap-3">
                                          <div className="col-span-2 lg:col-span-1">
                                            <div className="mb-2 text-sm">
                                              <label htmlFor="company-size" className="form-label">
                                                  Brand {index + 1} Name
                                              </label>
                                            </div>
                                            <input
                                              data-index={index}
                                              name="brands"
                                              className="form-control border-gray-300 focus:border-blue-600 form-input w-input"
                                              value={
                                                this.state.form.inputs.brands.value[index]['name']
                                              }
                                              onInput={this.setBrandName.bind(this)}
                                            />
                                          </div>
                                          <div className="col-span-2 lg:col-span-1">
                                            <div className="mb-2 text-sm">
                                              <label htmlFor="product-type">Food Vehicle</label>
                                            </div>
                                            <select
                                              data-index={index}
                                              name="brands"
                                              className="form-control border-gray-300 focus:border-blue-600 form-input  w-select"
                                              value={
                                                this.state.form.inputs.brands.value[index][
                                                  'product-type'
                                                ]
                                              }
                                              onChange={this.setBrandProductType.bind(this)}
                                            >
                                              <option>Choose an option</option>
                                              {this.state.product_type_list.map((i) => (
                                                <option key={i.id} value={i.id}>
                                                  {i.name}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        </div>
                                        {this.state.form.inputs.brands.value.length > 1 && (
                                          <div
                                            className="mb-8"
                                            style={{
                                              width: '25px',
                                              height: '25px',
                                              borderRadius: '50%',
                                              display: 'grid',
                                              placeItems: 'center',
                                              marginLeft: '10px',
                                              alignSelf: 'flex-end',
                                              cursor: 'pointer',
                                              border: '1px solid rgba(209, 213, 219, 1)',
                                            }}
                                            onClick={this.deleteBrand.bind(this, index)}
                                          >
                                            <svg
                                              className="fill-current text-black"
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="18"
                                              height="18"
                                              viewBox="0 0 18 18"
                                            >
                                              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <div className="mb-5 text-sm text-red-600">
                                        {this.state.form.inputs['brands'].errors[index]?.length
                                          ? this.state.form.inputs['brands'].errors[index][0]
                                          : ''}
                                      </div>
                                    </div>
                                  ))}
                                  <button
                                    className="btn w-full border-gray-100 focus:bg-gray-700 focus:border-gray-700 focus:text-white mb-5"
                                    style={{border: '1px solid rgba(209, 213, 219, 1)'}}
                                    onClick={this.addBrand.bind(this)}
                                    type="button"
                                  >
                                      Add another brand
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn w-full border-green-500 bg-green-500 focus:bg-green-700 focus:border-green-700 text-white"
                                  >
                                    {(this.state.form.loading && <Loader />) || (
                                      <span>Create Account</span>
                                    )}
                                  </button>
                                  <button
                                    className="btn w-full mt-5"
                                    onClick={() => this.setState((s) => s.page--)}
                                    type="button"
                                  >
                                      &larr; Go back
                                  </button>
                                </>
                              );
                            default:
                              return 'You shouldn\'t be seeing this!';
                          }
                        })()}
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default Page;
