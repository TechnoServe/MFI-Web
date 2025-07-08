import {Flex, Text} from '@chakra-ui/layout';
import React from 'react';

/**
 * Displays a placeholder "Coming Soon" message centered on the screen.
 *
 * @returns {JSX.Element} A centered Flex container with a large bold message.
 */
const ComingSoon = () => {
  return (
    // Container to center the message both vertically and horizontally
    <Flex
      className="padding-0"
      justifyContent="center"
      alignItems="center"
      height="90%"
      bg="white"
      style={{width: '100%'}}
    >
      {/* Display the "Coming Soon" message with bold styling and large font */}
      <Text fontWeight="bold" fontSize="50px">
        Coming Soon
      </Text>
    </Flex>
  );
};

export default ComingSoon;
