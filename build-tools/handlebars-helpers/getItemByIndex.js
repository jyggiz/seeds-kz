/**
 * Helper function to get item by index
 *
 * @param {Number} index - item index
 * @param {...any} items - array of items
 * @returns {Object} Item with given index
 */
module.exports = function (index, array) {
  if (!array || !array.length) {
    return null;
  }
  return array[index];
};
