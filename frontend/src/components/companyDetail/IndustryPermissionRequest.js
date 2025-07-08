import React from 'react';
import {FiEdit2} from 'react-icons/fi';
// import {GiConfirmed} from 'react-icons/Gi';
import {useDisclosure} from '@chakra-ui/react';
import {request} from 'common';
import propTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useToast
} from '@chakra-ui/react';
// import image from '../../assets/images/dangote-sugar.png';
import DenyPermission from 'components/companyDetail/DenyPermission';

/**
 * Modal trigger component that allows an admin to grant or deny permission for a company
 * to modify their Self-Assessment Tool (SAT) based on a specific product and tier.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.permissionRequest - Data for the company and product permission request.
 * @param {string} props.cycle - The cycle ID for which permission is being requested.
 * @returns {JSX.Element} React component with a modal UI for granting or denying SAT edit permission.
 */
const IndustryPermissionRequest = ({permissionRequest, cycle}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const toast = useToast();
  // /api/v1/admin/approve-sat?company-id=KKKL&cycle-id=HHHJJ

  // Extract relevant company, product, and tier information from the permission request
  const companyName = permissionRequest?.company_name;
  const productName = permissionRequest?.brands.map((x) => x.productType.name);
  const tier = permissionRequest.tier;
  // const latestPermission = permissionRequest.satScores.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  /**
   * Sends approval request to backend to allow company to edit SAT.
   * Displays toast based on result.
   */
  const setPermission = async () => {
    try {
      const companyId = permissionRequest.id;
      // const cycle = permissionRequest?.brands?.map((x) => x.productTests?.map((x) => x.results?.map((x) => x.cycle_id)));
      // const cycleId = cycle[0][0][0] === undefined ? '' : cycle[0][0][0];
      const res = await request(true).post(`admin/approve-sat?company-id=${companyId}&cycle-id=${cycle}`);

      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: res.data.success,
        duration: 6000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      return toast({
        status: 'error',
        title: 'Error',
        position: 'top-right',
        description: 'Unable to approve score.',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {/* Icon button that opens the permission modal */}
      <FiEdit2 onClick={onOpen} className="margin-left-2 background-color-white" style={{color: '#D6341F'}} />
      {/* {permissionRequest.satScores.length === 1 ?
          <GiConfirmed className="margin-left-2 background-color-white" style={{color: 'green'}} />
        : permissionRequest.satScores.length > 1 ?
            <FiEdit2 onClick={onOpen} className="margin-left-2 background-color-white" style={{color: '#D6341F'}} />

          : ''
      } */}


      {/* Modal UI to either approve or deny SAT edit request */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody className="background-color-white border-1px padding-top-4 box-shadow-large rounded-large width-150 padding-top-10">
            {/* <div className="background-color-white border-1px padding-top-4 box-shadow-large rounded-large width-150 padding-top-10"> */}
            <div className="flex-column-centered padding-x-16 padding-bottom-5">
              {/* <img src={image} loading="lazy" alt="" /> */}
              <div className="text-small text-color-body-text margin-top-4">Nigeria · {productName[0]} · {tier}</div>
            </div>
            <div className="flex-column-centered padding-x-16 padding-bottom-6">
              <h6 className="tracking-medium text-align-center width-9-12 margin-bottom-5">Give {companyName} permission to make changes to their SA Tool?</h6>
              <div>
                {/* Embedded component for denying permission and collecting reason */}
                <DenyPermission productName={productName[0]} tier={tier} />

                {/* Button to approve and trigger the backend permission API call */}
                <button onClick={setPermission} className="button button-small w-button">Give permission</button></div>
            </div>
            {/* </div> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

IndustryPermissionRequest.propTypes = {
  permissionRequest: propTypes.any,
  cycle: propTypes.any
};

export default IndustryPermissionRequest;
