import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import authReducer from 'store/auth-reducer';

/**
 * Configures and creates the Redux store.
 * Applies thunk middleware and combines all reducers.
 *
 * @returns {Store} Configured Redux store instance
 */
const store = createStore(
  // Combine individual reducers into a root reducer
  combineReducers({auth: authReducer}),
  // Apply Redux thunk middleware for handling async actions
  applyMiddleware(thunk)
);

// Export the configured store for use in the application
export default store;
