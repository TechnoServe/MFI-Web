import React from 'react';
import {Stack, Text, Flex} from '@chakra-ui/react';

/**
 * ContinueView component renders a prompt encouraging users to select a category
 * to continue using the Self Assessment Tool.
 *
 * @component
 * @returns {JSX.Element} Informational UI card with instructional message
 */
const ContinueView = () => {
  return (
    // Main container with border, shadow, and vertical layout
    <Flex
      className="background-color-white container-480 padding-0 box-shadow-small rounded-large"
      style={{
        boxShadow: 'Shadow/small',
        border: '1px solid #1D1C361A',
      }}
      flexDirection="column"
    >
      // Stack for positioning the instructional text inside the card
      <Stack flex="1" p="5">
        // Instructional message prompting the user to click a category
        <Text className="text-base" fontWeight="700" fontSize="20px" pt="7" pb="2">
          Click on a category to continue the Self Assessment Tool
        </Text>
      </Stack>
      // Footer-style placeholder bar for spacing or visual balance
      <Flex bg="#FAFAFA" h="64px" w="100%" p="4" justifyContent="space-between"></Flex>
    </Flex>
  );
};
export default ContinueView;
