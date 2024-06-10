"use strict";

const express = require("express");
const {
  apiKeyChecker,
  apiKeyPermissionChecker,
} = require("../middlewares/authChecker.middleware");
const { authentication } = require("../middlewares/authChecker.middleware");
const { ApiKeyPermission, apiKeyPermissionValueSchema } = require("../enums");
const router = express.Router();

const validPermissions = [
  new ApiKeyPermission(apiKeyPermissionValueSchema.Enum.All).id,
];

router.use(apiKeyChecker);
router.use(apiKeyPermissionChecker(validPermissions));

router.use("/v1/api", require("./access/nonAuth"));
router.use("/v1/api/product", require("./product/nonAuth"));

router.use(authentication);
router.use("/v1/api", require("./access/auth"));
router.use("/v1/api/product", require("./product/auth"));

module.exports = router;
