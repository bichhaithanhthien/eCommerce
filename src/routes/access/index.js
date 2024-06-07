"use strict";

const express = require("express");
const router = express.Router();

const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/router.helper");
const { authentication } = require("../../middlewares/authChecker.middleware");

router.post("/signUp", asyncHandler(accessController.signUp));
router.post("/login", asyncHandler(accessController.login));

router.use(authentication);
router.post("/logout", asyncHandler(accessController.logout));
router.post("/refreshToken", asyncHandler(accessController.refreshToken));

module.exports = router;
