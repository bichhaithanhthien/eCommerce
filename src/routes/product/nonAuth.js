"use strict";

const express = require("express");
const router = express.Router();

const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/router.helper");

router.post(
  "/search/:keySearch",
  asyncHandler(productController.searchProducts)
);

module.exports = router;
