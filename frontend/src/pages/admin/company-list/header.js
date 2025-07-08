import React, {useState} from 'react';
import {
  Container,
  Box,
  Flex,
  Button,
  Text,
  Spacer,
  Divider,
} from '@chakra-ui/react';
import InputField from 'components/customInput';
import CustomSelect from 'components/customSelect';
// import dummieData from 'Dummie/data';
import {searchArrayOfObject, downloadCSV} from 'utills/helpers';
import proptypes from 'prop-types';

import moment from 'moment';

/**
 * Admin dashboard header for the company list page.
 * Displays title, CSV download button, search input, and filter/sort dropdowns.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.company - Array of company data (currently unused).
 * @param {Array} props.newData - Array of new data used for search functionality.
 * @returns {JSX.Element} Header UI layout with controls.
 */
const Header = ({company, newData}) => {
  // Filter options for the dropdown select
  const filterArray = ['Country', 'Product Vehicle', 'Tire'];
  // Sorting options for the dropdown select
  const sorted = ['Date added', 'A-Z, Top - Bottom', 'A-Z, Bottom - Top'];
  const [loading, setIsLoading] = useState(false);
  // const [checkSearchClick, setCheckSearchClick] = useState(false);
  const [data, setData] = useState('');
  // Search handler (currently commented out logic for searching through newData)
  const search = (event) => {
    // setData(searchArrayOfObject(event.target.value, newData));
    // setCheckSearchClick(!checkSearchClick);
  };
  // Sorts company data alphabetically by company name
  const sortCompany = () => {
    const localeSort = Array.from(state).sort((a, b) => {
      return a.company_detail.name.localeCompare(b.company_detail.name, 'en', {sensitivity: 'base'});
    });
    setData(localeSort);
  };

  // Handles CSV download using helper method and sets loading state
  const handleDownloadCsv = () => {
    if (state.length) {
      setIsLoading(true);
      downloadCSV({
        fileName: `COMPANY LIST${moment().format('YYYYMMDDhhmmss')}`,
        data: state,
      });
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Box bg="#fff" fontFamily="DM Sans">
      {/* Top-level container with title and download button */}
      <Container maxW="container.xl" border="1px" borderColor="gray.200">
        <Flex
          direction="row"
          justify="space-between"
          alignItems="center"
          p="1rem"
        >
          <Text fontSize="1.25rem" fontWeight="700" lineHeight="1.6275rem">
            Companies Index
          </Text>
          <Button
            isLoading={loading}
            colorScheme="teal"
            loadingText="Downloading"
            w="8.3125rem"
            marginRight="0.5rem"
            bg="#00B27A"
            fontSize="13px"
            color="#ffffff"
            onClick={handleDownloadCsv}
          >
            Download CSV
          </Button>
        </Flex>
      </Container>
      <Divider borderWidth="1px" />

      {/* Secondary container with search input and filter/sort controls */}
      <Container maxW="container.xl" border="1px" borderColor="gray.200">
        <Flex
          direction="row"
          justify="space-between"
          alignItems="center"
          p="1rem"
          width="100%"
        >
          {/* Search input field */}
          <InputField
            placeholder="Search"
            name="search"
            search={search}
            onChange={search}
            bg="rgba(44,42,100,0.03)"
            variant="filled"
            width="31.25rem"
          />

          <Flex direction="row" justify="space-between" width="16rem">
            {/* Sorting dropdown */}
            <CustomSelect filter={sorted} placeholder="Sort" onChange={sortCompany} />
            <Spacer />
            {/* Filtering dropdown */}
            <CustomSelect
              filter={filterArray}
              placeholder="Filter"
              onChange={search}
            />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

Header.propTypes = {
  company: proptypes.any,
  newData: proptypes.any
};
export default Header;
