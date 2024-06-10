"use strict";

const express = require("express");
const router = express.Router();

const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/router.helper");

router.post("/signUp", asyncHandler(accessController.signUp));
router.post("/login", asyncHandler(accessController.login));

module.exports = router;
