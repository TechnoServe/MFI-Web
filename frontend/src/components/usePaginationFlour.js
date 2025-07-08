import React, {useState, useEffect} from 'react';
import {Text, Flex, Icon, IconButton, Select} from '@chakra-ui/react';
import {AiOutlineDoubleLeft, AiOutlineDoubleRight} from 'react-icons/ai';

/**
 * Custom React hook for paginating flour score data.
 *
 * @param {Array} filterResults - The full or filtered list of flour score data to paginate.
 * @returns {Object} An object containing:
 *   - PaginationFlourButtons: JSX.Element for rendering the pagination UI controls.
 *   - flourScores: Array of items for the current page.
 */
export function usePaginationFlourButtons(filterResults) {
  // Number of rows/items to display per page
  const [numTableFlourScores, setNumTableFlourScores] = useState(10);
  // Total number of pages based on dataset length
  const [numPages, setNumPages] = useState(1);
  // Current active pagination page
  const [paginationPage, setPaginationPage] = useState(1);
  // Paginated data items for the current page
  const [flourScores, setFlourScores] = useState([]);

  // Function to move to the next page
  const next = () => setPaginationPage((page) => page + 1);
  // Function to move to the previous page
  const previous = () => setPaginationPage((page) => page - 1);

  // Update paginated results and number of pages whenever data or pagination settings change
  useEffect(() => {
    const firstItemIndex = (paginationPage - 1) * numTableFlourScores;
    const lastItemIndex = firstItemIndex + numTableFlourScores;
    const numOfPages = Math.ceil(filterResults.length / numTableFlourScores);
    setNumPages(numOfPages);
    setFlourScores([...filterResults].slice(firstItemIndex, lastItemIndex));
  }, [numTableFlourScores, filterResults, paginationPage]);

  /**
   * Component that renders pagination buttons and items-per-page selector.
   *
   * @returns {JSX.Element} Pagination UI
   */
  const PaginationFlourButtons = () => (
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
          onChange={(e) => setNumTableFlourScores(Number(e.target.value))}
          size="xs"
          value={numTableFlourScores}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </Select>
      </Flex>
    </Flex>
  );
  // Return the pagination UI component and current page data
  return {PaginationFlourButtons, flourScores};
}
