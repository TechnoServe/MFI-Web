import React from 'react';
import {Stack, Text, Flex} from '@chakra-ui/react';

/**
 * ContinueView is a UI component that displays a prompt message for the user
 * to continue interacting with the Self Assessment Tool.
 *
 * @component
 * @returns {JSX.Element} A styled card prompting the user to select a category.
 */
const ContinueView = () => {
  // Container with card styling, shadow, and border
  return (
    <Flex
      className="background-color-white container-480 padding-0 box-shadow-small rounded-large"
      style={{
        boxShadow: 'Shadow/small',
        border: '1px solid #1D1C361A',
      }}
      flexDirection="column"
    >
      {/* Stack container for message text */}
      <Stack flex="1" p="5">
        {/* Prompt message encouraging user to select a category */}
        <Text className="text-base" fontWeight="700" fontSize="20px" pt="7" pb="2">
          Click on a category to continue the Self Assessment Tool
        </Text>
      </Stack>
      {/* Footer section with background and spacing (currently empty) */}
      <Flex bg="#FAFAFA" h="64px" w="100%" p="4" justifyContent="space-between"></Flex>
    </Flex>
  );
};
export default ContinueView;
