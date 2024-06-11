const parse = require("fast-json-parse");

global.parseJSON = function _parse(string, _default = {}) {
  const { value } = parse(string);
  return value || _default;
};
