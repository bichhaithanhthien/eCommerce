const express = require("express");
const router = express.Router();

const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/router.helper");

router.post("/logout", asyncHandler(accessController.logout));
router.post("/refreshToken", asyncHandler(accessController.refreshToken));

module.exports = router;
