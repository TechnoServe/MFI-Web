import ReactDOM from 'react-dom';
import React from 'react';
import {Provider} from 'react-redux';
import {ChakraProvider} from '@chakra-ui/react';
import store from 'store';
import App from './app';

import 'styles/normalize.css';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';

import 'theme/style.css';

/**
 * Renders the root React application.
 *
 * @param {React.ReactElement} App - The root application component
 * @returns {void}
 */
ReactDOM.render(
  // Wrap the app with Redux Provider for global state management
  <Provider store={store}>
    // Provide Chakra UI theming and context
    <ChakraProvider>
      // Render the main App component
      <App />
    </ChakraProvider>
  </Provider>,
  // Mount the React app to the DOM element with ID 'root'
  document.getElementById('root')
);
