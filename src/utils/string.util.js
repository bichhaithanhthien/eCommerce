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

const generateInvalidValueErrorMessage = (paramName, isPlural = false) => {
  return `This ${paramName} ${isPlural ? "are" : "is"} invalid.`;
};

const generateCreatedFailErrorMessage = (paramName) => {
  return `Created ${paramName} fail.`;
};

const generateCreatedSuccessMessage = (paramName) => {
  return `Created ${paramName} successfully.`;
};

const generateGetListSuccessMessage = (paramName) => {
  return `Get ${paramName} data list successfully.`;
};

module.exports = {
  generateNullErrorMessage,
  generateDuplicatedErrorMessage,
  generateNotFoundErrorMessage,
  generateInvalidValueErrorMessage,
  generateCreatedFailErrorMessage,
  generateCreatedSuccessMessage,
  generateGetListSuccessMessage,
};
