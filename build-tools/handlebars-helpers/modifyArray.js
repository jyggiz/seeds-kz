/**
 * @function modifyArray
 * @param {Array} targetArray - Target array of objects
 * @param {string} key - The key to be added/edited on each array item
 * @param {string} value - The value for the key
 * @returns {Array} A new array with modified items field
 */
module.exports = function modifyArray(targetArray, key, value) {
  return targetArray.map((item) => ({ ...item, [key]: value }));
};
