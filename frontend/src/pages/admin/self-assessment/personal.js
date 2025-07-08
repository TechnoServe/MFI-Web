import React, {useState} from 'react';
import Comments from './comments';
import Evidence from './evidence';

/**
 * Personal component represents the 'Personnel - Roles & Responsibilities' section
 * of the self-assessment form. Includes tier navigation tabs, instructional content,
 * evidence requirements, and comment section.
 *
 * @component
 * @returns {JSX.Element} Rendered page for personnel roles and evidence collection
 */
const Personal = () => {
  // Track currently selected tier tab (Tier 1, Tier 2, Tier 3)
  const [tab, setTab] = useState(0);

  return (
    <div style={{width: '100%'}}>
      {/* Sticky header section showing Personnel title and "Add member" button */}
      <div className="flex-row-middle flex-space-between padding-x-10 padding-y-4 border-bottom-1px height-20 background-color-white sticky-top-0">
        <div>
          <h6 className="margin-bottom-1">Personnel</h6>
          <div className="text-small">Roles &amp; responsibilities</div>
        </div>
        <div className="flex-space-between flex-row-middle">
          <img
            src="../images/Avatar%20Group%20(24px).svg"
            loading="lazy"
            height="32"
            alt=""
            className="margin-right-3"
          />
          <a href="#!" className="button-secondary button-small w-button">
            Add member
          </a>
        </div>
      </div>
      {/* Tier selection tabs for different levels of personnel */}
      <div data-duration-in="300" data-duration-out="100" className="w-tabs">
        <div className="flex-row-middle padding-x-10 background-color-white border-bottom-1px sticky-top-0 sticky-80px w-tab-menu">
          <a
            data-w-tab="Account"
            // Set active tab index on click
            onClick={() => setTab(0)}
            className={`tab-link width-auto padding-x-4 w-inline-block w-tab-link ${tab === 0 && 'w--current'
            }`}
          >
            <div className="text-small">Tier 1</div>
          </a>
          <a
            data-w-tab="Team"
            // Set active tab index on click
            onClick={() => setTab(1)}
            className={`tab-link width-auto padding-x-4 w-inline-block w-tab-link ${tab === 1 && 'w--current'
            }`}
          >
            <div className="text-small">Tier 2</div>
          </a>
          <a
            data-w-tab="Company"
            // Set active tab index on click
            onClick={() => setTab(2)}
            className={`tab-link width-auto padding-x-4 w-inline-block w-tab-link ${tab === 2 && 'w--current'
            }`}
          >
            <div className="text-small">Tier 3</div>
          </a>
        </div>
      </div>
      {/* Section title and explanation of the personnel indicator */}
      <div className="padding-x-10 margin-top-8 margin-bottom-5">
        <div>
          <div className="padding-bottom-5 border-bottom-1px">
            <h4 className="margin-bottom-2">Personnel - Roles &amp; responsibilities</h4>
            <div className="text-base medium text-color-body-text">
              Structural alignment, JDs, clarity
            </div>
          </div>
        </div>
        <div>
          <div className="margin-top-5">
            This indicator assesses the adequacy of the structure, independence and organisation of
            your company&#x27;s quality assurance function.
          </div>
        </div>
      </div>
      {/* Evidence descriptor with requirements checklist and status buttons */}
      <div className="padding-x-10">
        <div className="padding-top-6 padding-bottom-4">
          <div className="text-sub-header">Evidence descriptor</div>
        </div>
        <div className="background-color-white border-1px rounded-large padding-5">
          <h6 className="weight-medium">Requirements</h6>
          <ul role="list" className="padding-left-5 margin-bottom-5">
            <li className="text-small padding-bottom-4">
              Company has appropriate job description(s) for the production quality management (QA
              &amp; QC) roles.
            </li>
            <li className="text-small padding-bottom-4">
              The QM requirements are clearly understood by QM personnel and other staff/management
              involved in the production process..
            </li>
            <li className="text-small padding-bottom-4">
              QM roles cover all product specification and food fortfification requirements, both
              regulatory and industry-standard.
            </li>
            <li className="text-small padding-bottom-4">
              QM cover standards and assurance on calibration and measuring equipment, the quality
              of inputs and their storage, including fortification pre-mixes.
            </li>
          </ul>
          <h6 className="weight-medium">Select evidence status</h6>
          <div className="flex-row">
            <a
              href="#!"
              className="button-secondary button-small margin-right-3 width-1-3 flex-justify-center w-button"
            >
              Not met
            </a>
            <a
              href="#!"
              className="button-secondary button-small margin-right-3 width-1-3 flex-justify-center w-button"
            >
              Partly met
            </a>
            <a
              href="#!"
              className="button-secondary button-small margin-right-3 width-1-3 flex-justify-center w-button"
            >
              Mostly met
            </a>
            <a
              href="#!"
              className="button-secondary button-small margin-right-3 width-1-3 flex-justify-center w-button"
            >
              Fully met
            </a>
          </div>
        </div>
      </div>
      {/* Upload evidence component and comment thread */}
      <Evidence />
      <Comments />
      {/* Footer with Previous/Next navigation buttons */}
      <div className="sticky-bottom-0">
        <div className="background-color-white height-16 flex-row-middle flex-justify-end border-top-1px padding-x-10">
          <a href="#!" className="button-secondary button-small margin-right-3 w-button">
            Previous
          </a>
          <a href="#!" className="button button-small w-button">
            Next
          </a>
        </div>
      </div>
    </div>
  );
};

export default Personal;
