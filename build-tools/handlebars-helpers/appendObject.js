/**
 * Appends an object to an array and returns a new array.
 *
 * @param {object} obj - The object to append to the array.
 * @param {Array} array - The array to which the object will be appended.
 * @returns {Array} A new array containing the original array with the object appended.
 */
module.exports = function appendObject(obj, array) {
  if (!array) {
    return [obj];
  }

  if (!obj) {
    return array;
  }

  return [obj, ...array];
};
