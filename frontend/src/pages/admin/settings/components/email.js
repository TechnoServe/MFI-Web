import React, {useState} from 'react';
import {Text, useToast} from '@chakra-ui/react';
import {request} from 'common';
import PropTypes from 'prop-types';
import Loader from 'components/circular-loader';
import {EditorState, convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

/**
 * Email component allows admin users to compose and send an email to a specific company.
 * It uses a rich text editor for the message body and handles submission through an API call.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string|number} props.companyId - The ID of the company receiving the email
 * @returns {JSX.Element} The rendered email form interface
 */
const Email = ({companyId}) => {
  // State to track the email subject
  const [subject, setSubject] = useState(null);
  // State to track the email message using a DraftJS editor
  const [message, setMessage] = useState(EditorState.createEmpty());
  // State to track if email submission is in progress
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  /**
   * Sends the composed email to the backend for dispatch.
   * Converts the DraftJS content to HTML and includes it in the payload.
   *
   * @returns {Promise<void>} Shows success or error toast upon response
   */
  const sendMail = async () => {
    // Convert editor state to HTML for email message
    const messageToSend = draftToHtml(convertToRaw(message.getCurrentContent()));
    console.log('messageToSend', messageToSend);
    setLoading(true);
    try {
      // Send POST request to email endpoint with subject and message
      const body = {
        'company-id': companyId,
        'subject': subject,
        'message': messageToSend,
      };
      await request(true)
        .post(`admin/email?company-id=${companyId}`, body);
      setLoading(false);
      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: 'Email Sent',
        duration: 6000,
        isClosable: true,
      });
    } catch (error) {
      // Show error toast if email submission fails
      setLoading(false);
      return toast({
        status: 'error',
        title: 'Error',
        position: 'top-right',
        description: 'Email Sent',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  return (
    <div data-w-tab="Account" className="w-tab-pane w--tab-active">
      <div className="padding-x-10 padding-y-10 w-container">
        {/* Title text for the email section */}
        <Text className="text-align-left" fontSize="20px" fontWeight="700">
          Email Company(s)
        </Text>
        <div className="margin-top-10 margin-bottom-0 w-form">
          {/* Subject field input */}
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <input
            type="text"
            className="form-input margin-bottom-4 w-input"
            maxLength="256"
            name="subject"
            onChange={(e) => setSubject(e.target.value)}
            data-name="subject"
            id="subject"
            value={subject}
          />
          {/* Subject field input */}
          <label htmlFor="message" className="form-label">
            Message
          </label>
          {/* Rich text editor for composing the message body */}
          <Editor
            editorState={message}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setMessage}
          />

          <div className="margin-top-10">
            {/* Submit button for sending the email */}
            {/* Disabled when loading or required fields are empty */}
            <button
              disabled={(loading || !subject || !message)}
              onClick={sendMail}
              className="button w-button"
              style={{outline: 'none', backgroundColor: '#ECECEF'}}
            >
              {((loading || !subject || !message) && <Loader />) || <span style={{color: '#9696A6'}}>Send Email</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Email.propTypes = {
  companyId: PropTypes.any
};


export default Email;
