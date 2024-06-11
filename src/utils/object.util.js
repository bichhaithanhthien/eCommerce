const removeUndefinedValuesInNestedObject = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = removeUndefinedValuesInNestedObject(obj[key]);
      Object.keys(response).forEach((subKey) => {
        final[`${key}.${subKey}`] = response[subKey];
      });
    } else {
      if (obj[key] === undefined) {
        delete obj[key];
      } else {
        final[key] = obj[key];
      }
    }
  });
  return final;
};

module.exports = {
  removeUndefinedValuesInNestedObject,
};
