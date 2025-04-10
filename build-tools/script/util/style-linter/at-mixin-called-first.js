const stylelint = require('stylelint');

const ruleName = 'custom/at-mixin-called-first';

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected @include statement to be at the beginning of its block',
});

function isOneLineInclude(node) {
  return (
    node.type === 'atrule' &&
    node.name === 'include' &&
    node.source.start.line === node.source.end.line
  );
}

module.exports = stylelint.createPlugin(ruleName, (enabled) => {
  if (!enabled) {
    return;
  }

  return (root, result) => {
    root.walkRules((rule) => {
      const includeNodes = rule.nodes.filter(isOneLineInclude);

      if (includeNodes.length > 0) {
        const firstNonIncludeIndex = rule.nodes.findIndex((node) => !isOneLineInclude(node));

        if (firstNonIncludeIndex !== -1 && firstNonIncludeIndex < includeNodes.length) {
          stylelint.utils.report({
            ruleName,
            result,
            node: includeNodes[firstNonIncludeIndex],
            message: messages.expected,
            severity: 'warning',
          });
        }
      }
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
