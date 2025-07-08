import React, {Component} from 'react';
import Loader from 'components/circular-loader';
import {request} from 'common';
import logo from 'assets/images/logo.svg';
import {Link, withRouter} from 'react-router-dom';
import {authLogin, authSetUser} from 'store/action-types';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

/**
 * Page component for verifying a login token from a magic link.
 * Handles token validation, user authentication, and redirects based on user type.
 *
 * @class
 * @extends React.Component
 */
class Page extends Component {
  /**
   * Initializes state with flags for loading, token validity, and login success.
   *
   * @param {*} props - React component props
   */
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      invalid_token: false,
      login_success: false,
    };
  }

  /**
   * Validates the magic login token from the URL, authenticates the user,
   * fetches additional user data if needed, and redirects accordingly.
   *
   * @returns {void}
   */
  initUser() {
    // Extract token from query parameters
    const token = new URLSearchParams(window.location.search).get('token').trim();
    // If token is missing, mark as invalid
    if (!token) {
      this.setState({...this.setState, invalid_token: true});
      return;
    }

    request()
      .post(
        '/verify-login-token',
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      )
      // Handle successful verification response
      .then((res) => {
        // Validate presence of token and user in the response
        const {
          data: {token, user},
        } = res;
        if (!token || !user) {
          console.error('Invalid auth response.');
          this.setState({...this.setState, invalid_token: true});
          return;
        }
        this.props.dispatch(authLogin(user, token));
        // Redirect based on user type (company, ivc, admin)
        if (user.user_type.value === 'company') {
          this.props.dispatch(authSetUser(user));
          request(true)
            .get('company/details', {params: {'company-id': user.company_user.company_id}})
            .then(({data: {company}}) => {
              user.company = company;
              this.props.history.push('/company');
            });
        } else if (user.user_type.value === 'ivc') {
          this.props.history.push('/ivc');
        } else {
          this.props.history.push('/admin');
        }
      })
      // Handle token verification errors
      .catch((err) => {
        console.log(err);
        if (err.response.status == 401) {
          this.setState({...this.setState, invalid_token: true});
          return;
        }
        console.error(err.response.data);
      })
      // Stop loading spinner after all processing
      .finally(() => this.setState({...this.setState, loading: false}));
  }

  /**
   * React lifecycle method called after component mounts.
   * Starts the token verification process.
   *
   * @returns {void}
   */
  componentDidMount() {
    this.initUser();
  }

  /**
   * Renders the verification UI.
   * Displays a loader while verifying or an error message if failed.
   *
   * @returns {JSX.Element} The rendered verification result screen
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
            <div className="w-80 md:w-96 py-24 mx-auto">
              <div className="text-center">
                {
                  // Show loader while verifying token
                  ((this.state.loading || !this.state.invalid_token) && (
                    <>
                      <h4 className="mb-4 text-lg">Verifying Magic Link...</h4>
                      <Loader color="#10b981" />
                    </>
                  )) || (
                    <>
                      {
                        // Show error if token is invalid
                      }
                      <h4 className="mb-3 text-lg text-red-600">Login Failed</h4>
                      <Link to="/login" className="text-sm text-blue-700 underline">
                        Get a new link.
                      </Link>
                    </>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Page.propTypes = {
  history: PropTypes.any,
  dispatch: PropTypes.any,
};

export default connect()(withRouter(Page));
