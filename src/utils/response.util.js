"use strict";
const _ = require("lodash");

const filterResponseData = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields);
};

module.exports = {
  filterResponseData,
};
