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
import dummieData from 'Dummie/data';
import {searchArrayOfObject, downloadCSV} from 'utills/helpers';

import moment from 'moment';

/**
 * Header component for the Companies Index page.
 * Renders a header bar with search, sort, filter, and CSV download functionality.
 *
 * @component
 * @returns {JSX.Element} The rendered header UI for interacting with the company list.
 */
const Header = () => {
  // Filter options for the filter dropdown
  const filterArray = ['Country', 'Product Vehicle', 'Tire'];
  // Sort options for the sort dropdown
  const sorted = ['Date added', 'A-Z, Top - Bottom', 'A-Z, Bottom - Top'];
  // Loading state for the CSV download button
  const [loading, setIsLoading] = useState(false);
  // State used to trigger re-render or effect when search is performed
  const [checkSearchClick, setCheckSearchClick] = useState(false);

  /**
   * Handles search input to filter the company data.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input change event
   */
  const search = (event) => {
    setData(searchArrayOfObject(event.target.value, dummieData));
    setCheckSearchClick(!checkSearchClick);
  };

  /**
   * Sorts the company data by name in ascending alphabetical order.
   */
  const sortCompany =()=> {
    const localeSort = Array.from(state).sort((a, b) =>{
      return a.company_detail.name.localeCompare(b.company_detail.name, 'en', {sensitivity: 'base'});
    });
    setData(localeSort);
  };

  /**
   * Triggers the CSV download of the company list.
   * Uses moment to append a timestamp to the file name.
   */
  const handleDownloadCsv = () => {
    if (state.length) {
      setIsLoading(true);
      downloadCSV({
        fileName: `COMPANY LIST${moment().format('YYYYMMDDhhmmss')}`,
        data: state,
      });
    }
    setTimeout(()=>{
      setIsLoading(false);
    }, 2000);
  };

  // Outer container for the header content
  return (
    <Box bg="#fff" fontFamily="DM Sans">
      <Container maxW="container.xl" border="1px" borderColor="gray.200">
        {/* Top section: title and CSV download button */}
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

      <Container maxW="container.xl" border="1px" borderColor="gray.200">
        <Flex
          direction="row"
          justify="space-between"
          alignItems="center"
          p="1rem"
          width="100%"
        >
          {/* Search input field for filtering companies */}
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
            {/* Sort dropdown with predefined sort options */}
            <CustomSelect filter={sorted} placeholder="Sort" onChange={sortCompany} />
            <Spacer />
            {/* Filter dropdown with predefined filter options */}
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

export default Header;
