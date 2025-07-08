import exportFromJSON from 'export-from-json';

/**
 * Filters an array of objects to return items that include the search key.
 *
 * @param {string} key - The search keyword
 * @param {Array<Object>} arrayObject - Array of objects to be searched
 * @returns {Array<Object>} Filtered array of objects matching the key
 */
export const searchArrayOfObject =(key, arrayObject) =>{
  try {
    return arrayObject.filter((items) => {
      // Convert object to lowercase JSON string to perform case-insensitive search
      const flatObject = JSON.stringify(items).toLowerCase();
      return flatObject.includes(key.toLowerCase());
    });
  } catch (e) {
    return arrayObject;
  }
};

/**
 * Downloads data as a CSV (or other export type) file using export-from-json.
 *
 * @param {Object} param0 - Parameters object
 * @param {string} param0.fileName - Name of the output file
 * @param {string} [param0.exportType='csv'] - Type of export ('csv', 'xls', etc.)
 * @param {Array<Object>} param0.data - Data to be exported
 * @returns {void}
 */
export const downloadCSV = ({fileName, exportType, data}) =>{
  // Trigger file download with specified parameters
  return exportFromJSON({data, fileName, exportType: exportType || 'csv', withBOM: true});
};

/**
 * Extracts and returns the first error message from an API error object.
 *
 * @param {Object} e - The error object returned from API
 * @param {string|null} [fallback=null] - Fallback message if no error found
 * @returns {string|null} First error message or fallback
 */
export const getApiResponseErrorMessage = (e, fallback = null) => {
  const {errors} = e || {};
  if (!errors) return fallback;
  // Flatten nested error arrays and return the first message
  const [first] = Object.keys(errors).reduce((acc, v) => ([...acc, ...errors[v]]), []);
  return first;
};


/**
 * Retrieves the current company object from local storage.
 *
 * @returns {Object|null} Parsed company object or null if not found
 */
export const getCurrentCompany = () => {
  // Parse and return the company object from localStorage
  return JSON.parse(localStorage.getItem('company'));
}
