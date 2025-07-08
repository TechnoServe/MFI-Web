import React from 'react';
import fileZip from 'assets/images/tabler_file-zipThumbnail.svg';
import videoZip from 'assets/images/fi_videoThumbnail.svg';
import musicZip from 'assets/images/fi_musicThumbnail.svg';
import imageZip from 'assets/images/fi_imageThumbnail.svg';
import fileImg from 'assets/images/fi_fileThumbnail.svg';

/**
 * Evidence component renders a UI block allowing users to view and upload
 * supporting files (e.g., PDFs, videos, audio, images) for self-assessment evidence.
 *
 * @component
 * @returns {JSX.Element} A styled section with example file previews and file upload input
 */
const Evidence = () => {
  return (
    // Main container for evidence upload section
    <div className="padding-x-10 padding-bottom-6 border-bottom-1px">
      <div className="padding-top-6 padding-bottom-4">
        {/* Header for the evidence section */}
        <div className="text-sub-header">Evidence descriptor</div>
      </div>
      <div className="background-color-white border-1px rounded-large padding-5">
        {/* Section header and remove button row */}
        <div className="flex-row-middle flex-space-between margin-bottom-5">
          <h6 className="margin-bottom-0 weight-medium">Add supporting evidence</h6>
          <div className="padding-2">
            <div className="text-small text-danger">Remove</div>
          </div>
        </div>
        {/* Grid display of example uploaded files with thumbnails */}
        <div className="grid-5-columns margin-bottom-5">
          {/* File preview card showing icon and filename */}
          <div className="border-1px rounded-large">
            <div className="padding-y-4 flex-justify-center background-color-4">
              <img src={fileZip} loading="lazy" width="36" height="36" alt="" />
            </div>
            <div className="background-color-white border-top-1px flex-justify-center padding-y-2">
              <div className="text-tiny">A PDF file.pdf</div>
            </div>
          </div>
          {/* File preview card showing icon and filename */}
          <div className="border-1px rounded-large">
            <div className="padding-y-4 flex-justify-center background-color-4">
              <img src={videoZip} loading="lazy" width="36" height="36" alt="" />
            </div>
            <div className="background-color-white border-top-1px flex-justify-center padding-y-2">
              <div className="text-tiny">A Video file.mp4</div>
            </div>
          </div>
          {/* File preview card showing icon and filename */}
          <div className="border-1px rounded-large">
            <div className="padding-y-4 flex-justify-center background-color-4">
              <img src={musicZip} loading="lazy" width="36" height="36" alt="" />
            </div>
            <div className="background-color-white border-top-1px flex-justify-center padding-y-2">
              <div className="text-tiny">An Audio file.mp3</div>
            </div>
          </div>
          {/* File preview card showing icon and filename */}
          <div className="border-1px rounded-large">
            <div className="padding-y-4 flex-justify-center background-color-4">
              <img src={imageZip} loading="lazy" width="36" height="36" alt="" />
            </div>
            <div className="background-color-white border-top-1px flex-justify-center padding-y-2">
              <div className="text-tiny">An Image file.pdf</div>
            </div>
          </div>
          {/* File preview card showing icon and filename */}
          <div className="border-1px rounded-large">
            <div className="padding-y-4 flex-justify-center background-color-4">
              <img src={fileImg} loading="lazy" width="36" height="36" alt="" />
            </div>
            <div className="background-color-white border-top-1px flex-justify-center padding-y-2">
              <div className="text-tiny">Unknown file.xyz</div>
            </div>
          </div>
        </div>
        {/* Pagination indicators for file previews */}
        <div className="flex-row-middle flex-justify-center margin-bottom-5">
          <div className="pagination-dot"></div>
          <div className="pagination-dot active"></div>
          <div className="pagination-dot active"></div>
        </div>
        {/* Footer section with upload instructions and file input */}
        <div className="fafafa rounded-large flex-space-between flex-row-middle padding-3">
          <div className="text-small text-color-body-text">
            Max file size for upload is 10mb. Supports most file types
          </div>
          <input type="file" className="button-secondary button-small w-button" />
        </div>
      </div>
    </div>
  );
};

export default Evidence;
