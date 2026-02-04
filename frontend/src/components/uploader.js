import React, {useEffect} from 'react';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import propTypes from 'prop-types';

const Uppy = require('@uppy/core');
const XHRUpload = require('@uppy/xhr-upload');
const Dashboard = require('@uppy/dashboard');
const GoogleDrive = require('@uppy/google-drive');

const UPLOAD_ENDPOINT = 'https://selfassessment.mfi-ng.org/api/v1/documents';
const COMPANION_URL = 'https://mfi-companion.herokuapp.com';

let BTN_INSTANCE_COUNT = 0;
const getNextBtnInstanceId = () => `UppyModalOpenerBtn-${++BTN_INSTANCE_COUNT}`;
const getAuthToken = () => sessionStorage.getItem('auth-token');

/**
 * Uploader component using Uppy for document uploads.
 * Supports uploading files with metadata and integrates Google Drive support.
 *
 * @param {Object} props - Component props.
 * @param {string} props.companyId - ID of the company uploading the document.
 * @param {string} props.categoryId - ID of the document category.
 * @param {Function} props.onComplete - Callback when upload is complete.
 * @param {string} props.cycle - ID of the current cycle.
 * @returns {JSX.Element} Button that triggers the Uppy Dashboard modal.
 */
export const Uploader = ({companyId = '12345', categoryId = '12345', onComplete = () => undefined, cycle}) => {
  // Generate a unique ID for the upload button used to trigger the Uppy dashboard
  const btnId = getNextBtnInstanceId();
  // Set up Uppy instance on component mount and clean up on unmount
  useEffect(() => {
    // Create a new Uppy instance with configuration for file restrictions and metadata
    const uppy = new Uppy({
      debug: true,
      autoProceed: false,
      restrictions: {
        maxFileSize: 10000000,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        // https://uppy.io/docs/uppy/#restrictions
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        allowedFileTypes: undefined, // ['application/*', 'image/*'],
      },
      meta: {
        category_id: categoryId,
        cycle: cycle,
        company_id: companyId
      },
    })
      // Configure upload endpoint and authorization header
      .use(XHRUpload, {
        endpoint: UPLOAD_ENDPOINT,
        fieldName: 'document',
        headers: {
          authorization: `Bearer ${getAuthToken()}`,
        },
      })
      // Set up the Uppy Dashboard UI with file name and caption fields
      .use(Dashboard, {
        trigger: `#${btnId}`,
        showProgressDetails: true,
        note: 'PDF only up to 10 MB',
        height: 470,
        metaFields: [
          {id: 'name', name: 'Name', placeholder: 'file name'},
          {id: 'caption', name: 'Caption', placeholder: 'describe what the document is about'},
        ],
        browserBackButtonClose: false,
      })
      // Enable Google Drive file selection through the Uppy Companion server
      .use(GoogleDrive, {
        target: Dashboard,
        companionUrl: COMPANION_URL,
      });

    // Handle upload completion and invoke callback
    uppy.on('complete', (result) => {
      onComplete(result);
    });
    // Clean up the Uppy instance on component unmount
    return () => {
      uppy.close();
    };
  }, []);
  // Render the button that opens the Uppy modal dashboard
  return (
    <button id={btnId} className="button-secondary button-small w-button" style={{outline: 'none'}}>
      Uploader
    </button>
  );
};

Uploader.propTypes = {
  categoryId: propTypes.string,
  onComplete: propTypes.func,
  cycle: propTypes.string,
  companyId: propTypes.string,
};
