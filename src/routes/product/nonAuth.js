const express = require("express");
const router = express.Router();

const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/router.helper");

router.post(
  "/search/:keySearch",
  asyncHandler(productController.searchProducts)
);
router.post("", asyncHandler(productController.getProducts));
router.get("/:productId", asyncHandler(productController.getProduct));

module.exports = router;
