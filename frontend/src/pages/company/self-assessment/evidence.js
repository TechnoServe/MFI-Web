import React, {useEffect, useState} from 'react';
import fileZip from 'assets/images/tabler_file-zipThumbnail.svg';
// import videoZip from 'assets/images/fi_videoThumbnail.svg';
// import musicZip from 'assets/images/fi_musicThumbnail.svg';
import imageZip from 'assets/images/fi_imageThumbnail.svg';
import fileImg from 'assets/images/fi_fileThumbnail.svg';
import propTypes from 'prop-types';
import {request} from 'common';
import {Flex, Spinner, CloseButton} from '@chakra-ui/react';
import {Uploader} from '../../../components/uploader';
import {nanoid} from '@reduxjs/toolkit';

/**
 * Evidence component displays and manages supporting document uploads for a given SAT category.
 * It shows uploaded evidence, allows deletion, and integrates with the Uploader for new uploads.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string|number} props.categoryId - ID of the current assessment category
 * @param {string|number} props.companyId - ID of the company uploading the evidence
 * @param {string|number} props.cycle - The current SAT cycle identifier
 * @returns {JSX.Element} Rendered component showing evidence uploads and an upload interface
 */
const Evidence = ({categoryId, companyId, cycle}) => {
  const [loading, setLoading] = useState(true);
  const [btnLoad, setBtnLoad] = useState(false);
  const [docs, setDocs] = useState([]);

  /**
   * Fetches documents from the backend for a given category and cycle.
   * @param {boolean} type - If true, activates the loading spinner
   * @returns {Promise<void>}
   */
  const getDocuments = async (type) => {
    type && setLoading(true);
    try {
      const {data: res} = await request(true).get(`/documents/list/category/${categoryId}?company_id=${companyId}&cycle=${cycle}`);
      setDocs(res.result);
      type && setLoading(false);
    } catch (error) {
      type && setLoading(false);
      return toast({
        status: 'error',
        title: 'Error',
        position: 'top-right',
        description: 'Something went wrong',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  /**
   * Deletes a specific uploaded document by ID.
   * @param {string|number} id - The ID of the document to delete
   * @returns {Promise<void>}
   */
  const deleteDocuments = async (id) => {
    setBtnLoad(true);
    try {
      await request(true).delete(`/documents/${id}`);
      getDocuments();
      setBtnLoad(false);
    } catch (error) {
      setBtnLoad(false);
      return toast({
        status: 'error',
        title: 'Error',
        position: 'top-right',
        description: 'Something went wrong',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  // Handler to refresh the document list after upload
  const refreshDocumentsHandler = () => {
    // refresh
    getDocuments(1); // ???
  };

  // Fetch documents when categoryId changes
  useEffect(() => {
    getDocuments(1);
  }, [categoryId]);

  return (
    <div className="padding-x-10 padding-bottom-6 border-bottom-1px">
      <div className="padding-top-6 padding-bottom-4">
        <div className="text-sub-header">Evidence descriptor</div>
      </div>
      <div className="background-color-white border-1px rounded-large padding-5">
        <div className="flex-row-middle flex-space-between margin-bottom-5">
          <h6 className="margin-bottom-0 weight-medium">Add supporting evidence</h6>
        </div>
        {loading ? (
          <Flex
            height="100%"
            width="100%"
            mb="10"
            justifyContent="center"
            alignItems="center
     "
          >
            <Spinner />
          </Flex>
        ) : (
          <div className="grid-5-columns margin-bottom-5">
            {docs.map(({content_type: contentType, original_file_name: originalFileName, id, file_name: fileName, storage_id: storageId}) => {
              // Render preview card for each document based on its content type (PDF, image, other)
              return contentType === 'application/pdf' ? (
                <div key={id} className="border-1px rounded-large">
                  <Flex className="background-color-4" justify="flex-end">
                    {/* Button to delete the document */}
                    <CloseButton
                      size="sm"
                      isDisabled={btnLoad}
                      onClick={() => deleteDocuments(id)}
                    />
                  </Flex>
                  <div className="padding-y-4 flex-justify-center background-color-4">
                    {/* File type thumbnail */}
                    <img src={fileZip} loading="lazy" width="36" height="36" alt="" />
                  </div>
                  <div className="background-color-white border-top-1px flex-justify-center padding-y-2">
                    <div className="text-tiny" style={{padding: 5}}>
                      {/* Link to download/view the uploaded file */}
                      <a href={`https://www.googleapis.com/download/storage/v1/b/technoserve-mfi.appspot.com/o/${fileName}?generation=${storageId.toString().split('/').pop()}&alt=media`}> {originalFileName} </a>
                    </div>
                  </div>
                </div>
              ) : contentType.includes('image') ? (
                <div key={nanoid()} className="border-1px rounded-large">
                  <Flex className="background-color-4" justify="flex-end">
                    {/* Button to delete the document */}
                    <CloseButton
                      size="sm"
                      isDisabled={btnLoad}
                      onClick={() => deleteDocuments(id)}
                    />
                  </Flex>
                  <div className="padding-y-4 flex-justify-center background-color-4">
                    {/* File type thumbnail */}
                    <img src={imageZip} loading="lazy" width="36" height="36" alt="" />
                  </div>
                  <div className="background-color-white border-top-1px flex-justify-center padding-y-2">
                    <div className="text-tiny" style={{padding: 5}}>
                      {/* Link to download/view the uploaded file */}
                      <a href={`https://www.googleapis.com/download/storage/v1/b/technoserve-mfi.appspot.com/o/${fileName}?generation=${storageId.toString().split('/').pop()}&alt=media`}> {originalFileName} </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={nanoid()} className="border-1px rounded-large">
                  <Flex className="background-color-4" justify="flex-end">
                    {/* Button to delete the document */}
                    <CloseButton
                      size="sm"
                      isDisabled={btnLoad}
                      onClick={() => deleteDocuments(id)}
                    />
                  </Flex>
                  <div className="padding-y-4 flex-justify-center background-color-4">
                    {/* File type thumbnail */}
                    <img src={fileImg} loading="lazy" width="36" height="36" alt="" />
                  </div>
                  <div className="background-color-white border-top-1px flex-justify-center padding-y-2">
                    <div className="text-tiny" style={{padding: 5}}>
                      {/* Link to download/view the uploaded file */}
                      <a href={`https://www.googleapis.com/download/storage/v1/b/technoserve-mfi.appspot.com/o/${fileName}?generation=${storageId.toString().split('/').pop()}&alt=media`}> {originalFileName} </a>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* <div className="border-1px rounded-large">
              <div className="padding-y-4 flex-justify-center background-color-4">
                <img src={videoZip} loading="lazy" width="36" height="36" alt="" />
              </div>
              <div className="background-color-white border-top-1px flex-justify-center padding-y-2">
                <div className="text-tiny">A Video file.mp4</div>
              </div>
            </div>
            <div className="border-1px rounded-large">
              <div className="padding-y-4 flex-justify-center background-color-4">
                <img src={musicZip} loading="lazy" width="36" height="36" alt="" />
              </div>
              <div className="background-color-white border-top-1px flex-justify-center padding-y-2">
                <div className="text-tiny">An Audio file.mp3</div>
              </div>
            </div> */}
          </div>
        )}
        <div className="flex-row-middle flex-justify-center margin-bottom-5">
          <div className="pagination-dot"></div>
          <div className="pagination-dot active"></div>
          <div className="pagination-dot active"></div>
        </div>
        <div className="fafafa rounded-large flex-space-between flex-row-middle padding-3">
          <div className="text-small text-color-body-text">
            Max file size for upload is 10mb. Supports most file types
          </div>
          {/* Upload control that triggers document refresh upon successful upload */}
          <Uploader categoryId={categoryId} onComplete={refreshDocumentsHandler} cycle={cycle} />
        </div>
      </div>
    </div>
  );
};

Evidence.propTypes = {
  categoryId: propTypes.any,
  parentId: propTypes.any,
  companyId: propTypes.any,
  cycle: propTypes.any
};

export default Evidence;
