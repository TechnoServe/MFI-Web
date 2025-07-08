import React, {useState, useEffect} from 'react';
import {Text, Flex, Icon, IconButton, Select} from '@chakra-ui/react';
import {AiOutlineDoubleLeft, AiOutlineDoubleRight} from 'react-icons/ai';

/**
 * Custom React hook for paginating a dataset and rendering pagination controls.
 *
 * @param {Array} filterResults - The dataset to paginate (can be filtered or full list).
 * @returns {Object} Contains:
 *   - PaginationButtons: JSX Element to render the pagination controls.
 *   - allIndustryScores: Array of items for the current page.
 */
export function usePagination(filterResults) {
  // Number of items to display per page
  const [numTableAllIndustryScores, setNumTableAllIndustryScores] = useState(100);

  // Total number of pages
  const [numPages, setNumPages] = useState(1);

  // Current active page number
  const [paginationPage, setPaginationPage] = useState(1);

  // Data items to display on the current page
  const [allIndustryScores, setAllIndustryScores] = useState([]);

  // Go to next page
  const next = () => setPaginationPage((page) => page + 1);

  // Go to previous page
  const previous = () => setPaginationPage((page) => page - 1);

  // Update paginated data when page, filterResults, or page size changes
  useEffect(() => {
    const firstItemIndex = (paginationPage - 1) * numTableAllIndustryScores;
    const lastItemIndex = firstItemIndex + numTableAllIndustryScores;
    const numOfPages = Math.ceil(filterResults.length / numTableAllIndustryScores);
    setNumPages(numOfPages);
    setAllIndustryScores([...filterResults].slice(firstItemIndex, lastItemIndex));
  }, [numTableAllIndustryScores, filterResults, paginationPage]);

  /**
   * Renders pagination controls and page size selector.
   *
   * @returns {JSX.Element} Pagination UI.
   */
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
  // Expose pagination controls and current page data
  return {PaginationButtons, allIndustryScores};
}
