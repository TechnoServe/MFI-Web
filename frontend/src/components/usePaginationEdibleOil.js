import React, {useState, useEffect} from 'react';
import {Text, Flex, Icon, IconButton, Select} from '@chakra-ui/react';
import {AiOutlineDoubleLeft, AiOutlineDoubleRight} from 'react-icons/ai';

/**
 * Custom hook for handling pagination of edible oil score data.
 *
 * @param {Array} filterResults - The filtered or full list of edible oil data items to paginate.
 * @returns {Object} Object containing:
 *   - PaginationEdibleOilButtons: JSX Element to render pagination controls.
 *   - edibleOilScores: Array of items for the current page.
 */
export function usePaginationEdibleOilButtons(filterResults) {
  // Number of rows/items to display per page
  const [numTableEdibleOilScores, setNumTableEdibleOilScores] = useState(10);
  // Total number of pages based on dataset length
  const [numPages, setNumPages] = useState(1);
  // Current active pagination page
  const [paginationPage, setPaginationPage] = useState(1);
  // Paginated items for current page
  const [edibleOilScores, setEdibleOilScores] = useState([]);

  // Go to next page
  const next = () => setPaginationPage((page) => page + 1);

  // Go to previous page
  const previous = () => setPaginationPage((page) => page - 1);

  // Update paginated items and total pages when data or page settings change
  useEffect(() => {
    const firstItemIndex = (paginationPage - 1) * numTableEdibleOilScores;
    const lastItemIndex = firstItemIndex + numTableEdibleOilScores;
    const numOfPages = Math.ceil(filterResults.length / numTableEdibleOilScores);
    setNumPages(numOfPages);
    setEdibleOilScores([...filterResults].slice(firstItemIndex, lastItemIndex));
  }, [numTableEdibleOilScores, filterResults, paginationPage]);

  /**
   * Component that renders pagination UI controls and page size selector.
   * @returns {JSX.Element} Pagination UI for navigating and changing page size.
   */
  const PaginationEdibleOilButtons = () => (
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
          onChange={(e) => setNumTableEdibleOilScores(Number(e.target.value))}
          size="xs"
          value={numTableEdibleOilScores}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </Select>
      </Flex>
    </Flex>
  );
  // Expose pagination controls and current page data
  return {PaginationEdibleOilButtons, edibleOilScores};
}
