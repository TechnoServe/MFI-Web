import React, {Component} from 'react';
import confirmationIfg from 'assets/images/confirmation.png';

/**
 * Fragment component that displays a confirmation message after registration or login,
 * prompting the user to verify their email.
 *
 * @extends React.Component
 * @param {Object} props - React component props
 * @returns {JSX.Element} Rendered confirmation message fragment
 */
class Fragment extends Component {
  /**
   * Constructor for the Fragment component
   * @param {Object} props - React component properties
   */
  constructor(props) {
    super(props);
  }
  /**
   * Renders the confirmation UI with an icon and instructions.
   * @returns {JSX.Element} Confirmation message layout
   */
  render() {
    return (
      <>
        {/* Container for the confirmation image */}
        <div className="grid place-items-center mb-5">
          <img src={confirmationIfg} width="80" className="block" />
        </div>
        {/* Text section with heading and instructional message */}
        <div className="text-center mb-28">
          <h4 className="text-2xl font-bold mb-3">Verify your email</h4>
          <p className="text-sm text-gray-800">
            A verification link has been sent to your mail. <br /> Use the link to access your
            account.
          </p>
        </div>
      </>
    );
  }
}

export default Fragment;
