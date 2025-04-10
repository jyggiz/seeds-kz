/**
 * @function appendArray
 * @param {Array} originalArray - The original array
 * @param {...any} items - The items to be appended to the array
 * @returns {Array} A new array containing the original items and the new items
 */
module.exports = function appendArray(originalArray, ...items) {
  return [...originalArray, ...items.slice(0, items.length - 1)];
};
