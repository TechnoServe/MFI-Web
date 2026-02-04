import ComingSoon from 'components/coming-soon';
import CompaniesIndex from 'pages/company/company-index';
import ivcCompanyIndex from 'pages/ivc/company-index';
import AdminCompanyIndex from 'pages/admin/company-list';
import Settings from 'pages/company/settings';
import AdminSettings from 'pages/admin/settings';
import IVCSettings from 'pages/ivc/settings';
import SelfAssessment from 'pages/company/self-assessment';
import AdminSelfAssessment from 'pages/admin/self-assessment';
import axios from 'axios';
// import Companies from 'pages/admin/company-list';
import Dashboard from 'pages/company/dashboard';
// import AdminDashboard from 'pages/admin/dashboard';
import AdminDashboardV2 from 'pages/admin/dashboard-v2';
import IvcAssessment from 'pages/ivc/self-assessment';

/**
 * Creates a configured Axios instance for making HTTP requests to the backend API.
 * Automatically adds an Authorization header (Bearer token) if `secure` is true.
 * Includes an interceptor to handle 401 Unauthorized responses.
 *
 * @param {boolean} secure - Whether to include the Authorization token from sessionStorage.
 * @returns {import('axios').AxiosInstance} Configured Axios instance.
 */
export function request(secure = false) {
  // const toast = useToast();

  const headers = {
    'Accept': 'application/json, text/plain,*/*',
    'Content-Type': 'application/json',
  };

  const instance = axios.create({
    baseURL: '/api/v1',
    headers,
  });

  // Attach Authorization header for secure requests
  instance.interceptors.request.use(
    (config) => {
      if (secure) {
        const token =
          sessionStorage.getItem('auth-token') ||
          sessionStorage.getItem('token') ||
          localStorage.getItem('auth-token') ||
          localStorage.getItem('token');

        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  // Handle 401 errors globally for secure routes
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (secure && err.response && err.response.status == 401) {
        // sessionStorage.removeItem('auth-token');
        // sessionStorage.removeItem('auth-token');
      }
      return Promise.reject(err);
    }
  );

  return instance;
}

/**
 * Paths available to users who are not logged in
 * @constant
 */
export const PROTECTED_PATHS = {
  COMPANY: '/company',
  ADMIN: '/admin',
  IVC: '/ivc',
  HOME: 'updates',
  DASHBOARD: 'dashboard',
  SELF_ASSESSMENT: 'self-assessment',
  ADMIN_SELF_ASSESSMENT: 'self-assessment',
  HELP: 'help',
  SETTINGS: 'settings',
  COMPANIES_INDEX: 'companies-index',
};

const {HOME, DASHBOARD, SELF_ASSESSMENT, ADMIN_SELF_ASSESSMENT, HELP, SETTINGS, COMPANIES_INDEX} = PROTECTED_PATHS;

// Routes and components available for logged-in company users
export const SUB_ROUTES = [
  {path: DASHBOARD, page: Dashboard, exact: true},
  {path: HOME, page: ComingSoon, exact: true},
  {path: SELF_ASSESSMENT, page: SelfAssessment, exact: true},
  {path: HELP, page: ComingSoon, exact: true},
  {path: SETTINGS, page: Settings, exact: true},
  {path: COMPANIES_INDEX, page: CompaniesIndex, exact: true},
];

// Routes and components available for admin users
export const ADMIN_SUB_ROUTES = [
  {path: DASHBOARD, page: AdminDashboardV2, exact: true},
  {path: ADMIN_SELF_ASSESSMENT, page: AdminSelfAssessment, exact: true},
  {path: SETTINGS, page: AdminSettings, exact: true},
  {path: COMPANIES_INDEX, page: AdminCompanyIndex, exact: true},
];

// Routes and components available for IVC users
export const IVC_SUB_ROUTES = [
  {path: DASHBOARD, page: ComingSoon, exact: true},
  {path: HOME, page: ComingSoon, exact: true},
  {path: SELF_ASSESSMENT, page: IvcAssessment, exact: true},
  {path: HELP, page: ComingSoon, exact: true},
  {path: SETTINGS, page: IVCSettings, exact: true},
  {path: COMPANIES_INDEX, page: ivcCompanyIndex, exact: true},
];
