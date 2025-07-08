import React from 'react';
import {Select} from '@chakra-ui/react';
import propTypes from 'prop-types';

/**
 * A customizable dropdown select component using Chakra UI.
 * Dynamically renders options based on the provided `filter` array.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.placeholder] - Placeholder text for the select dropdown.
 * @param {Function} props.onChange - Handler function called when the selected option changes.
 * @param {Array<string>} props.filter - Array of strings to render as dropdown options.
 * @param {...Object} restProps - Additional props spread to the Select component.
 * @returns {JSX.Element} Chakra UI Select component with mapped options.
 */
const CustomSelect = ({
  placeholder = '',
  onChange,
  filter,
  ...restProps
}) => {
  // Render a Chakra UI Select with dynamic options and margin
  return (
    <Select placeholder={placeholder} size='md' {...restProps} onChange={onChange} margin={['0', '0.5rem']}>
      {
        // Map each item in the filter array to an <option> element
        filter.map((item, index)=>(
          <option value={item} key={index}>{item}</option>
        ))
      }
    </Select>
  );
};

CustomSelect.propTypes = {
  placeholder: propTypes.any,
  onChange: propTypes.any,
  filter: propTypes.any,
  variant: propTypes.any,
};


export default CustomSelect;
