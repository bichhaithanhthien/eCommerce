const { filterResponseData } = require("../../utils/response.util");

const formatProductResponse = (product) => {
  return filterResponseData({
    object: product,
    fields: [
      "_id",
      "productName",
      "productThumb",
      "productDescription",
      "productPrice",
      "productQuantity",
      "productType",
      "productAttributes",
      "productRatingAverage",
      "productStatus",
      "productSeller",
      "productSlug",
    ],
  });
};

module.exports = {
  formatProductResponse,
};
