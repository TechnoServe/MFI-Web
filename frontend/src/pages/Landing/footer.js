import React from 'react';
import logo from 'assets/mfilogo.png';
import arrowUp from 'assets/images/Arrow-Down20px.svg';

/**
 * LandingFooter component displays the footer section of the landing page,
 * including the company logo, navigation links, and a scroll-to-top button.
 *
 * @component
 * @returns {JSX.Element} A responsive footer layout with branding and helpful links
 */
const LandingFooter = () => {
  return (
    // Outer container for the footer with standard margin and layout class
    <div className="container-1280 margin-bottom-10 wf-section">
      {/* // Inner footer layout container */}
      <div className="footer-10">
        <div className="container">
          {/* // Grid layout for organizing footer columns */}
          <div className="w-layout-grid footer-grid-02">
            {/* // Footer column with logo and copyright */}
            <div
              id="w-node-_5c35d527-7e3f-7442-fdbd-6d4eb5a800c3-da9fef06"
              className="footer-column"
            >
              <img src={logo} loading="lazy" width="150" alt="" className="margin-right-4" />
              <p className="text-small">
                © 2025 MFI Ltd.
                <br />
                Powered by <span className="link"><a href=" https://www.technoserve.org/" target="_blank">TechnoServe</a></span>
              </p>
            </div>
            {/* // Footer column with company-related links */}
            <div className="footer-column">
              <div className="footer-title">Company</div>
              <a
                href="https://technoserve.gitbook.io/mfi-by-technoserve/contact-us"
                target="_blank"
                rel="noreferrer"
                className="footer-link-dark"
              >
                Contact
              </a>
              <a
                href="https://technoserve.gitbook.io/mfi-by-technoserve/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="footer-link-dark"
              >
                Privacy Policy
              </a>
            </div>
            {/* // Footer column with About and documentation links */}
            <div className="footer-column">
              <div className="footer-title">About</div>
              <a
                href="https://technoserve.gitbook.io/mfi-by-technoserve/frequently-asked-questions-faqs"
                target="_blank"
                rel="noreferrer"
                className="footer-link-dark"
              >
                FAQs
              </a>
              <a
                href="https://technoserve.gitbook.io/mfi-by-technoserve/"
                target="_blank"
                rel="noreferrer"
                className="footer-link-dark"
              >
                Documentation
              </a>
            </div>
            {/* // Scroll-to-top button with arrow image */}
            <a href="#Hero" className="footer-arrow box-shadow-large w-inline-block">
              <img src={arrowUp} alt="" className="flip-vertical" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingFooter;
