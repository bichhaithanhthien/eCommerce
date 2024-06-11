"use strict";

const convertSelectFields = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const convertUnselectFields = (unselect = []) => {
  return Object.fromEntries(unselect.map((el) => [el, 0]));
};

module.exports = {
  convertSelectFields,
  convertUnselectFields,
};
