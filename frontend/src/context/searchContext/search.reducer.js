/**
 * Reducer function for managing search context state.
 * Handles searching, toggling a 'starred' state, and fetching data.
 *
 * @param {Array<Object>} state - Current search state array.
 * @param {Object} action - Action dispatched to modify state.
 * @param {string} action.type - Type of action ('SEARCH', 'TOGGLE', 'FETCH').
 * @param {Array<Object>} [action.data] - New data for 'SEARCH' or 'FETCH' actions.
 * @param {string|number} [action.id] - ID of item to toggle star state.
 * @returns {Array<Object>} Updated state based on action type.
 */
const searchReducer = (state, action) =>{
  switch (action.type) {
    // Replace current state with new search results
    case 'SEARCH':
      return [...action.data];

    // Toggle the 'star' boolean property of the item with matching ID
    case 'TOGGLE':
      return state?.map((datum) =>{
        // If item ID matches action.id, toggle its 'star' property
        return datum.id == action?.id ? {...datum, star: !datum.star}: datum;
      });

    // Replace state with freshly fetched data
    case 'FETCH':
      return [...action.data];

    // Return current state for unknown action types
    default:
      return state;
  }
};
export default searchReducer;
