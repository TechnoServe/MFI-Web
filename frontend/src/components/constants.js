import settingsClosed from 'assets/images/Settings-Icon.svg';
import dashbaordClosed from 'assets/images/Dashboard.svg';
import satClosed from 'assets/images/Self-Assessment-Icon.svg';
import settings from 'assets/images/settings.svg';
import company from 'assets/images/company.svg';
import dashbaord from 'assets/images/graph.svg';
import {PROTECTED_PATHS} from 'common';
import CompanyIndex from 'assets/images/Companies-Index-Icon.svg';
import asess from 'assets/images/pen.svg';

const {DASHBOARD, SELF_ASSESSMENT, SETTINGS, COMPANIES_INDEX} = PROTECTED_PATHS;
/**
 * Navigation links used for company user roles.
 *
 * @constant
 * @type {Array<Object>}
 * @property {string} name - Identifier for the navigation item.
 * @property {string} to - Route path for the navigation.
 * @property {string} icon - Path to default icon image.
 * @property {string} [icon2] - Optional path to alternate icon (e.g., inactive state).
 * @returns {Array<Object>} Array of navigation configuration objects.
 */
// Company user navigation items
export const companyNavs = [
  {
    name: 'companies-index',
    to: COMPANIES_INDEX,
    icon: company,
  },
  {
    name: 'dashboard',
    to: DASHBOARD,
    icon: dashbaord,
    icon2: dashbaordClosed,
  },
  {
    name: 'self-assessment',
    to: SELF_ASSESSMENT,
    icon: asess,
    icon2: satClosed,
  },
  {
    name: 'settings',
    to: SETTINGS,
    icon: settingsClosed,
    icon2: settings,
  },
];

/**
 * Navigation links used for IVC user roles.
 *
 * @constant
 * @type {Array<Object>}
 * @returns {Array<Object>} Array of IVC navigation items.
 */
// IVC user navigation items
export const ivcNavs = [
  {
    name: 'companies-index',
    to: COMPANIES_INDEX,
    icon: company,
  },
  {
    name: 'settings',
    to: SETTINGS,
    icon: settingsClosed,
    icon2: settings,
  },
];

/**
 * Navigation links used for admin user roles.
 *
 * @constant
 * @type {Array<Object>}
 * @returns {Array<Object>} Array of admin navigation items.
 */
// Admin user navigation items
export const adminNavs = [
  {
    name: 'dashboard',
    to: DASHBOARD,
    icon: dashbaord,
    icon2: dashbaordClosed,
  },
  {
    name: 'companies-index',
    to: COMPANIES_INDEX,
    icon: CompanyIndex,
    icon2: company,
  },
  {
    name: 'settings',
    to: SETTINGS,
    icon: settingsClosed,
    icon2: settings,
  },
];
