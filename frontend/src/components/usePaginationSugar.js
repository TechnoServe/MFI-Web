import React, {useState, useEffect} from 'react';
import {Text, Flex, Icon, IconButton, Select} from '@chakra-ui/react';
import {AiOutlineDoubleLeft, AiOutlineDoubleRight} from 'react-icons/ai';

/**
 * Custom React hook for paginating sugar score data and rendering pagination controls.
 *
 * @param {Array} filterResults - The full or filtered list of sugar score data to paginate.
 * @returns {Object} An object containing:
 *   - PaginationSugarButtons: JSX.Element for rendering pagination UI controls.
 *   - sugarScores: Array of items for the current page.
 */
export function usePaginationSugarButtons(filterResults) {
  // Number of items to display per page
  const [numTableSugarScores, setNumTableSugarScores] = useState(10);
  // Total number of pages based on the dataset length
  const [numPages, setNumPages] = useState(1);
  // Current active page number
  const [paginationPage, setPaginationPage] = useState(1);
  // Paginated items for the current page
  const [sugarScores, setSugarScores] = useState([]);

  // Navigate to the next page
  const next = () => setPaginationPage((page) => page + 1);

  // Navigate to the previous page
  const previous = () => setPaginationPage((page) => page - 1);

  // Calculate which items to display based on current page and page size
  useEffect(() => {
    const firstItemIndex = (paginationPage - 1) * numTableSugarScores;
    const lastItemIndex = firstItemIndex + numTableSugarScores;
    const numOfPages = Math.ceil(filterResults.length / numTableSugarScores);
    setNumPages(numOfPages);
    setSugarScores([...filterResults].slice(firstItemIndex, lastItemIndex));
  }, [numTableSugarScores, filterResults, paginationPage]);

  /**
   * Renders pagination controls and page size selector.
   *
   * @returns {JSX.Element} Pagination UI.
   */
  const PaginationSugarButtons = () => (
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
          onChange={(e) => setNumTableSugarScores(Number(e.target.value))}
          size="xs"
          value={numTableSugarScores}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </Select>
      </Flex>
    </Flex>
  );
  // Return the pagination component and current page data
  return {PaginationSugarButtons, sugarScores};
}
