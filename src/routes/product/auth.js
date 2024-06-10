"use strict";

const express = require("express");
const router = express.Router();

const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/router.helper");

router.post("/create", asyncHandler(productController.createProduct));
router.post("/draft/:id", asyncHandler(productController.draftProduct));
router.post("/publish/:id", asyncHandler(productController.publishProduct));
router.post("/unpublish/:id", asyncHandler(productController.unpublishProduct));

router.get(
  "/draft/all",
  asyncHandler(productController.getDraftProductsBySeller)
);
router.get(
  "/publish/all",
  asyncHandler(productController.getPublishedProductsBySeller)
);
router.get(
  "/unpublish/all",
  asyncHandler(productController.getUnpublishedProductsBySeller)
);

module.exports = router;
