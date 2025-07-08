import React, {useState, useEffect} from 'react';
import {Text, Flex, Icon, IconButton, Select} from '@chakra-ui/react';
import {AiOutlineDoubleLeft, AiOutlineDoubleRight} from 'react-icons/ai';

/**
 * Custom React hook to handle client-side pagination of a dataset.
 *
 * @param {Array} filterResults - The full dataset or filtered results to paginate.
 * @returns {Object} Object containing:
 *  - PaginationButtons: React component rendering pagination UI controls.
 *  - allIndustryScores: Array of paginated items for the current page.
 */
export function usePagination(filterResults) {
  // Number of rows/items per page
  const [numTableAllIndustryScores, setNumTableAllIndustryScores] = useState(10);
  // Total number of pages based on dataset length
  const [numPages, setNumPages] = useState(1);
  // Current active pagination page
  const [paginationPage, setPaginationPage] = useState(1);
  // Subset of data for the current page
  const [allIndustryScores, setAllIndustryScores] = useState([]);

  // Navigate to the next page
  const next = () => setPaginationPage((page) => page + 1);

  // Navigate to the previous page
  const previous = () => setPaginationPage((page) => page - 1);

  useEffect(() => {
    // Calculate indices for slicing the dataset and update the paginated data
    const firstItemIndex = (paginationPage - 1) * numTableAllIndustryScores;
    const lastItemIndex = firstItemIndex + numTableAllIndustryScores;
    const numOfPages = Math.ceil(filterResults.length / numTableAllIndustryScores);
    setNumPages(numOfPages);
    setAllIndustryScores([...filterResults].slice(firstItemIndex, lastItemIndex));
  }, [numTableAllIndustryScores, filterResults, paginationPage]);

  // Component that renders pagination controls and page size selector
  const PaginationButtons = () => (
    <Flex flexWrap="wrap" p={2}>
      <Text mr={['auto', 'auto', '4rem']} mb={4} color="#637381" fontSize="small">
        Showing {paginationPage} of {numPages || 1}
      </Text>
      <Flex>
        <IconButton
          aria-label="go to previous page"
          mr={4}
          size="xs"
          icon={<Icon as={AiOutlineDoubleLeft} />}
          disabled={paginationPage <= 1}
          onClick={previous}
        />
        <Text mr={4} color="#637381" fontSize="small">
          {paginationPage}
        </Text>

        <IconButton
          aria-label="go to next page"
          mr={4}
          size="xs"
          icon={<Icon as={AiOutlineDoubleRight} />}
          disabled={paginationPage === numPages || !numPages}
          onClick={next}
        />
        <Select
          onChange={(e) => setNumTableAllIndustryScores(Number(e.target.value))}
          size="xs"
          value={numTableAllIndustryScores}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </Select>
      </Flex>
    </Flex>
  );
  // Return pagination UI component and paginated data
  return {PaginationButtons, allIndustryScores};
}
