import React from 'react';
import {Flex, Input, InputGroup, InputLeftElement} from '@chakra-ui/react';
import propTypes from 'prop-types';
import {BiSearch} from 'react-icons/bi';
/**
 * Reusable input field component with optional search icon and event handlers.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.placeholder] - Placeholder text for the input.
 * @param {string} [props.type='text'] - Input type (e.g., text, password).
 * @param {string} props.name - Input name attribute.
 * @param {Function} props.onChange - Handler for input change events.
 * @param {Function} props.search - Handler for keyup search events.
 * @param {string} props.value - Current input value.
 * @returns {JSX.Element} A Chakra UI styled input field with optional search icon.
 */
const InputField = ({
  placeholder = '',
  type = 'text',
  name,
  onChange,
  search,
  value,
  ...restProps
}) => {
  return (
    <Flex w="100%">
      {/* Wrap input and icon inside Chakra UI InputGroup for styling */}
      <InputGroup>
        {/* Display a non-interactive search icon on the left side of the input */}
        <InputLeftElement pointerEvents="none" color="gray.500" >{<BiSearch />}</InputLeftElement>
        {/* Core input element with change and keyup event handling */}
        <Input
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          type={type}
          value={value}
          onKeyUp={search}
          {...restProps}
        />
      </InputGroup>
    </Flex>
  );
};

InputField.propTypes = {
  placeholder: propTypes.any,
  type: propTypes.any,
  name: propTypes.any,
  onChange: propTypes.any,
  search: propTypes.any,
  value: propTypes.any,
  variant: propTypes.any,
};


export default InputField;
