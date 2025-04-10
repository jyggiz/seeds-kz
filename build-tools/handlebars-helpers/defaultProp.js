/**
 * A Handlebars helper that returns a default value if the property is undefined.
 *
 * @param {any} prop - The property to check for undefined.
 * @param {any} defaultValue - The default value to return if the property is undefined.
 * @returns {any} - The property value if it's defined, otherwise the default value.
 */
module.exports = function (prop, defaultValue) {
  return prop !== undefined ? prop : defaultValue;
};
