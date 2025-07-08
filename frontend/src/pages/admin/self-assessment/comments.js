import React from 'react';
import leftAvatar from 'assets/images/LeftAvatar.svg';
import {nanoid} from '@reduxjs/toolkit';

/**
 * Comments component renders a styled comments section UI.
 * Includes dropdown filters, a static comment block, and a reply input prompt.
 *
 * @component
 * @returns {JSX.Element} The rendered comments section
 */
const Comments = () => {
  // Container for the entire comments section
  return (
    <div className="padding-x-10 padding-bottom-6 padding-top-6">
      <div className="padding-5 rounded-large background-secondary-2">
        <div>
          <div className="flex-row-middle flex-space-between margin-bottom-5">
            <h6 className="margin-bottom-0 weight-medium">Comments</h6>
          </div>
        </div>
        <div>
          {/* Dropdown to filter comments by date */}
          <div className="flex-justify-center margin-y-5">
            <div data-hover="" data-delay="0" className="w-dropdown">
              <div className="rounded-full padding-y-1 padding-left-3 background-secondary-2 w-dropdown-toggle">
                <div className="text-color-body-text w-icon-dropdown-toggle"></div>
                <div className="text-small text-color-body-text">Yesterday</div>
              </div>
              <nav className="background-color-white rounded-large box-shadow-large w-dropdown-list">
                <a href="#" className="dropdown-link w-dropdown-link">
                  Today
                </a>
                <a href="#" className="dropdown-link w-dropdown-link">
                  Last 3 days
                </a>
                <a href="#" className="dropdown-link w-dropdown-link">
                  Last week
                </a>
              </nav>
            </div>
          </div>
        </div>
        {/* Render a single static comment block (loop structure allows for future dynamic rendering) */}
        {[1].map(() => (
          <div key={nanoid()}>
            <div className="flex-row border-bottom-1px">
              <img
                src={leftAvatar}
                loading="lazy"
                alt=""
                className="width-9 height-9 rounded-full margin-right-4"
              />
              <div>
                <div className="flex-row-middle">
                  <div>
                    <div className="flex-row-middle">
                      <div className="text-base medium margin-right-2">Felicia Akuntu</div>
                      <div className="text-tiny text-align-left uppercase text-color-body-text">
                        8:00 AM
                      </div>
                    </div>
                    <div className="text-small text-color-body-text">
                      Independent Validation Consultant
                    </div>
                  </div>
                </div>
                <p className="text-small margin-top-3 margin-bottom-5">
                  <span className="text-span">@Benjamin Godswill</span> Your Job Descriptions should
                  suffice here
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* Reply input field with placeholder and paperclip icon */}
        <div className="form-input small flex-row-middle flex-space-between">
          <div className="text-small text-color-body-text">Leave a reply...</div>
          <img src="../images/paperclip.svg" loading="lazy" width="20" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Comments;
