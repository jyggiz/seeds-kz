const cloneDeep = require('lodash/cloneDeep');
const set = require('lodash/set');
const { chunkArray } = require('../../src/app/util/chunkArray');

/**
 * Set the value of one or more (nested) properties on an object.
 * @param {object} obj - The object whose properties should be set.
 * @param {...string} pathsAndValues - The paths and values to set, in key-value pairs.
 * @returns {object} A new object with the desired properties set.
 */
module.exports = function (obj, ...pathsAndValues) {
  const pathAndValuePairs = chunkArray(pathsAndValues, 2, false);

  const updatedObj = cloneDeep(obj);
  pathAndValuePairs.forEach((pair) => {
    const path = pair[0];
    const value = pair[1];
    set(updatedObj, path, value);
  });

  return updatedObj;
};

//Example: {{> myPartial props=(setProperties props 'name' 'John' 'address.state' 'NY') }}
