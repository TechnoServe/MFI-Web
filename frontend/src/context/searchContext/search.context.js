import React, {createContext, useReducer} from 'react';
import searchReducer from './search.reducer';
import propTypes from 'prop-types';

export const SearchContext = createContext();
export const DispatchContext = createContext();

const defaultValue = [{name: 'Dangote Flour Mills', product: 'flour', country: 'Nigeria', tier: 3, sa: '32%', star: false}];


/**
 * Provider component for managing and supplying search-related context state and dispatch.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components that consume the context.
 * @returns {JSX.Element} A provider wrapping children with SearchContext and DispatchContext.
 */
export const SearchProvider = ({children}) => {
  // Initialize reducer with default search values for context state management
  const [state, dispatch] = useReducer(searchReducer, defaultValue);

  // Provide the search state to consuming components
  return (
    <SearchContext.Provider value={state}>
      {/* Provide the dispatch function for updating the search state */}
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: propTypes.any,
};
