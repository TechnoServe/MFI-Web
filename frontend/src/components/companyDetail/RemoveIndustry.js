import React from 'react';
import propTypes from 'prop-types';
import {useDisclosure} from '@chakra-ui/react';
import {request} from 'common';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Text
} from '@chakra-ui/react';
import {GrClose} from 'react-icons/gr';

/**
 * Modal component that allows an admin to remove a company from the live index.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.company - Company object containing at least the ID and name.
 * @returns {JSX.Element} Modal with confirmation UI to delete the company.
 */
const RemoveIndustry = ({company}) => {
  // Chakra UI hook to control modal visibility
  const {isOpen, onOpen, onClose} = useDisclosure();

  // Sends a DELETE request to remove the company and shows a toast notification
  const removeCompany = async () => {
    const res = await request(true).delete(`admin/company/delete/${company.id}`);
    if (res.status === 200) {
      // Reloads the page after a successful delete with a delay
      setTimeout(() => {
        location.reload();
      }, 2000);
      // Show success or error toast based on API response
      return toast({
        status: 'success',
        title: 'success',
        position: 'top-right',
        description: `${res.data.success}`,
        duration: 6000,
        isClosable: true,
      });
    } else {
      // Show success or error toast based on API response
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


  return (
    <>
      {/* Trigger modal open when user clicks the close icon */}
      <GrClose onClick={onOpen} style={{color: '#D6341F'}} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Text
              fontFamily="DM Sans"
              fontWeight="700"
              fontSize="16px"
              fontStyle="normal"
              color="#1E1F24"
              height="21px"
              my="1.5rem"
            >
              Confirm Remove
            </Text>
            <Text
              fontFamily="DM Sans"
              fontWeight="normal"
              fontSize="14px"
              fontStyle="normal"
              color="#1E1F24"
              lineHeight="21px"
              my="1.5rem"
            >
              {company?.company_name} will be removed from the Live Index.
            </Text>
            {/* Action buttons for canceling or confirming removal */}
            <ModalFooter className="padding-y-6 padding-x-4 flex-justify-end background-secondary border-top-1px rounded-large bottom sticky-bottom-0">
              <div>
                <a className="button-secondary button-small margin-right-3 w-button">Cancel</a>
                <a onClick={() => removeCompany()} className="button-danger button-small w-button">Confirm Remove</a>
              </div>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

RemoveIndustry.propTypes = {
  company: propTypes.any
};

export default RemoveIndustry;
