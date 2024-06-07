"use strict";
const {
  CreatedResponse,
  SuccessResponse,
} = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res) => {
    new CreatedResponse({
      message: "Registered a new user successfully.",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  login = async (req, res) => {
    new SuccessResponse({
      message: "Login successfully.",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res) => {
    new SuccessResponse({
      message: "Logout successfully.",
      metadata: await AccessService.logout(req.tokenKey),
    }).send(res);
  };

  refreshToken = async (req, res) => {
    new SuccessResponse({
      message: "Refreshed the user's token successfully.",
      metadata: await AccessService.refreshTokenHandler({
        tokenKey: req.tokenKey,
        user: req.user,
        token: req.token,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
