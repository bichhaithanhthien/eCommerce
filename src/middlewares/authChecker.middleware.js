"use strict";
const {
  HEADER_API_KEY,
  HEADER_CLIENT_ID,
  HEADER_CLIENT_TOKEN,
} = require("../constants/header.constant");
const {
  REASON_STATUS_CODES,
  STATUS_CODES,
} = require("../constants/responseCode.constant");
const {
  AuthFailureErrorResponse,
  NotFoundErrorResponse,
} = require("../core/error.response");
const { asyncHandler } = require("../helpers/router.helper");
const ApiKeyService = require("../services/apiKey.service");
const TokenKeyService = require("../services/tokenKey.service");
const { generateNotFoundErrorMessage } = require("../utils/string.util");
const { verifyJWT } = require("../utils/auth.util");
const UserService = require("../services/user.service");

const apiKeyChecker = async (req, res, next) => {
  try {
    const apiKey = req.headers[HEADER_API_KEY]?.toString();
    if (!apiKey) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        message: REASON_STATUS_CODES.FORBIDDEN,
      });
    }

    const objApiKey = await ApiKeyService.findOneByKey(apiKey);
    if (!objApiKey) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        message: REASON_STATUS_CODES.FORBIDDEN,
      });
    }

    req.objApiKey = objApiKey;
    return next();
  } catch (error) {
    return res.status(STATUS_CODES.FORBIDDEN).json({
      message: error.message,
    });
  }
};

const apiKeyPermissionChecker = (validPermissions) => {
  return (req, res, next) => {
    const apiKeyPermissions = req.objApiKey.permissions;
    let isValid = apiKeyPermissions.length > 0;

    if (isValid) {
      for (let i = 0; i < apiKeyPermissions.length; i++) {
        const targetPermission = apiKeyPermissions[i];
        if (!validPermissions.includes(targetPermission)) {
          isValid = false;
          break;
        }
      }
    }

    if (!isValid) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        message: "Permission denied",
      });
    }
    return next();
  };
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER_CLIENT_ID];
  if (!userId) throw new AuthFailureErrorResponse("Invalid Request");

  const tokenKey = await TokenKeyService.findOneByUserId(userId);
  if (!tokenKey)
    throw new NotFoundErrorResponse(generateNotFoundErrorMessage("token key"));

  const token = req.headers[HEADER_CLIENT_TOKEN];
  if (!token) throw new AuthFailureErrorResponse("Invalid Request");

  const decodeUser = await verifyJWT(token, tokenKey.privateKey);
  if (userId !== decodeUser.userId)
    throw new AuthFailureErrorResponse("Invalid Request");

  const existUser = await UserService.findOneByEmail({
    email: decodeUser.email,
  });
  if (!existUser)
    throw new NotFoundErrorResponse(generateNotFoundErrorMessage("user"));

  req.tokenKey = tokenKey;
  req.user = decodeUser;
  req.token = token;

  return next();
});

module.exports = {
  apiKeyChecker,
  apiKeyPermissionChecker,
  authentication,
};
