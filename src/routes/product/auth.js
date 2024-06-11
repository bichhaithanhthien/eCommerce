const express = require("express");
const router = express.Router();

const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/router.helper");

router.post("/create", asyncHandler(productController.createProduct));
router.post("/:productId", asyncHandler(productController.getProductBySeller));
router.post("/draft/:productId", asyncHandler(productController.draftProduct));
router.post(
  "/publish/:productId",
  asyncHandler(productController.publishProduct)
);
router.post(
  "/unpublish/:productId",
  asyncHandler(productController.unpublishProduct)
);

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

router.patch("/:productId", asyncHandler(productController.updateProduct));

module.exports = router;
