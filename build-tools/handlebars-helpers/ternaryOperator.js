module.exports = function (predicate, consequent, alternative) {
  return predicate ? consequent : alternative;
};
