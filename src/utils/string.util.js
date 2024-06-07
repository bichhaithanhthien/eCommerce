"use strict";

const generateNullErrorMessage = (paramName) => {
  return `This ${paramName} is null.`;
};

const generateDuplicatedErrorMessage = (paramName) => {
  return `This ${paramName} already exists.`;
};

const generateNotFoundErrorMessage = (paramName) => {
  return `This ${paramName} is not found.`;
};

module.exports = {
  generateNullErrorMessage,
  generateDuplicatedErrorMessage,
  generateNotFoundErrorMessage,
};
