import React, {useEffect, useState} from 'react';
import fileZip from 'assets/images/tabler_file-zipThumbnail.svg';
// import videoZip from 'assets/images/fi_videoThumbnail.svg';
// import musicZip from 'assets/images/fi_musicThumbnail.svg';
// import imageZip from 'assets/images/fi_imageThumbnail.svg';
// import fileImg from 'assets/images/fi_fileThumbnail.svg';
import propTypes from 'prop-types';
import {request} from 'common';
import {Flex, CloseButton, Spinner} from '@chakra-ui/react';
import {Uploader} from '../../../components/uploader';
// import {nanoid} from '@reduxjs/toolkit';
import {getCurrentCompany} from '../../../utills/helpers';

const Evidence = ({categoryId}) => {
  const [loading, setLoading] = useState(true);
  const [btnLoad, setBtnLoad] = useState(false);
  const [docs, setDocs] = useState([]);
  const currentCompany = getCurrentCompany();
  const {id: companyId} = currentCompany;
  const cycleID = 'vJqDawZlrKNHsMIW9G2s';

  const getDocuments = async (type) => {
    type && setLoading(true);
    type && setLoading(true);
    try {
      const {data: res} = await request(true).get(`/documents/list/category/${categoryId}?company_id=${companyId}&cycle_id=${cycleID}`);
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

  const refreshDocumentsHandler = () => {
    // refresh
    getDocuments(1); // ???
  };

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
            {docs.map((x) =>
              <div key={x.id} className="border-1px rounded-large">
                <Flex className="background-color-4" justify="flex-end">
                  <CloseButton
                    size="sm"
                    isDisabled={btnLoad}
                    onClick={() => deleteDocuments(id)}
                  />
                </Flex>
                <div className="padding-y-4 flex-justify-center background-color-4">
                  <img src={fileZip} loading="lazy" width="36" height="36" alt="" />
                </div>
                <div style={{cursor: 'pointer'}} className="background-color-white border-top-1px flex-justify-center padding-y-2">
                  <div className="text-tiny" style={{padding: 5}}>
                    <a href={`https://www.googleapis.com/download/storage/v1/b/technoserve-mfi.appspot.com/o/${x.file_name}?generation=${x.storage_id.toString().split('/').pop()}&alt=media`}> {x.original_file_name} </a>
                  </div>
                </div>
              </div>
            )}

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
          <Uploader companyId={companyId} categoryId={categoryId} onComplete={refreshDocumentsHandler} cycle={cycleID} />
        </div>
      </div>
    </div>
  );
};

Evidence.propTypes = {
  categoryId: propTypes.any,
  parentId: propTypes.any,
};

export default Evidence;
