import React from 'react';
import {Button, Flex, Text, Icon} from '@chakra-ui/react';
import {FcCheckmark} from 'react-icons/fc';
import propTypes from 'prop-types';

/**
 * FinishAnswer component displays a confirmation message after answers are submitted.
 * It shows a success icon and message, with a "Continue" button if not at the end of the subcategory.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.moveToNext - Callback to proceed to the next question or section
 * @param {boolean} props.endOfSubCat - Indicates if the current subcategory has ended
 * @returns {JSX.Element} Rendered success confirmation UI
 */
const FinishAnswer = ({moveToNext, endOfSubCat}) => {
  // Outer container for the success message UI
  return (
    <Flex
      height="90vh"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      className="flex-row-middle padding-x-10 background-color-white border-bottom-1px sticky-top-0 sticky-80px w-tab-menu"
    >
      {/* Green checkmark icon in a circular background to indicate success */}
      <Flex
        justifyContent="center"
        alignItems="center"
        w="120px"
        h="120px"
        bg="rgba(0, 178, 119, 0.13)"
        mt="-200px"
        borderRadius="50%"
      >
        <Icon fontSize="40px" as={FcCheckmark} />
      </Flex>
      {/* Confirmation message text */}
      <Text mt="5" fontWeight="700" fontSize="20px" color="rgba(0, 0, 0, 1)" textAlign="center">
        Your answers have been uploaded successfully
      </Text>
      {/* Instructional message depending on whether subcategory has ended */}
      <Text textAlign="center" color="rgba(28, 29, 38, 0.6)">
        {endOfSubCat ?
          'Please select next category ' :
          'Click continue to proceed to the next requirement'}
      </Text>
      {/* Render "Continue" button only if it's not the end of the subcategory */}
      {endOfSubCat ? (
        ''
      ) : (
        <Button mt="5" _focus={{outline: 'none'}} onClick={moveToNext} bg="#00B27A" color="white">
          Continue
        </Button>
      )}
    </Flex>
  );
};

FinishAnswer.propTypes = {
  moveToNext: propTypes.any,
  endOfSubCat: propTypes.any,
};

export default FinishAnswer;
