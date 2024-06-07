"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserModel = require("../models/user.model");
const {
  generateNullErrorMessage,
  generateDuplicatedErrorMessage,
  generateNotFoundErrorMessage,
} = require("../utils/string.util");
const TokenKeyService = require("./tokenKey.service");
const { createToken } = require("../utils/auth.util");
const { filterResponseData } = require("../utils/response.util");
const {
  ErrorResponse,
  ConflictErrorResponse,
  BadRequestErrorResponse,
  AuthFailureErrorResponse,
  NotFoundErrorResponse,
  ForbiddenErrorResponse,
} = require("../core/error.response");
const UserService = require("./user.service");
const TokenKeyModel = require("../models/tokenKey.model");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    if (!name)
      throw new BadRequestErrorResponse(generateNullErrorMessage("name"));
    if (!email)
      throw new BadRequestErrorResponse(generateNullErrorMessage("email"));
    if (!password)
      throw new BadRequestErrorResponse(generateNullErrorMessage("password"));

    const existUserByEmail = await UserModel.findOne({ email }).lean();
    if (existUserByEmail)
      throw new ConflictErrorResponse(generateDuplicatedErrorMessage("email"));

    const existUserByName = await UserModel.findOne({ name }).lean();
    if (existUserByName)
      throw new ConflictErrorResponse(generateDuplicatedErrorMessage("name"));

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const token = await createOrUpdateUserToken(newUser);
      return {
        user: filterResponseData({
          object: newUser,
          fields: ["_id", "name", "email"],
        }),
        token,
      };
    }
  };

  static login = async ({ email, password }) => {
    const existUser = await UserService.findOneByEmail({ email });
    if (!existUser)
      throw new NotFoundErrorResponse(generateNotFoundErrorMessage("user"));

    const isMatched = bcrypt.compare(password, existUser.password);
    if (!isMatched) throw new AuthFailureErrorResponse("Authentication Error");

    const token = await createOrUpdateUserToken(existUser);
    return {
      user: filterResponseData({
        object: existUser,
        fields: ["_id", "name", "email"],
      }),
      token,
    };
  };

  static logout = async (tokenKey) => {
    return await TokenKeyService.deleteOneById(tokenKey._id);
  };

  static refreshTokenHandler = async ({ tokenKey, user, token }) => {
    const { userId, email } = user;

    if (tokenKey.usedToken.includes(token)) {
      await TokenKeyService.deleteOneByUserId(userId);
      throw new ForbiddenErrorResponse(
        "Something wrong happened, please login again."
      );
    }

    if (tokenKey.token !== token)
      throw new BadRequestErrorResponse("Invalid token.");

    const newToken = await createToken({ userId, email }, tokenKey.privateKey);

    await TokenKeyModel.updateOne(
      { _id: tokenKey._id },
      {
        $set: {
          token: newToken,
        },
        $addToSet: {
          usedToken: token,
        },
      }
    );

    return { token: newToken };
  };
}

const createOrUpdateUserToken = async ({ _id, email }) => {
  const privateKey = crypto.randomBytes(64).toString("hex");

  const token = await createToken(
    {
      userId: _id,
      email,
    },
    privateKey
  );

  const tokenKey = await TokenKeyService.createOrUpdateTokenKey({
    userId: _id,
    privateKey,
    token,
  });
  if (!tokenKey) throw new ErrorResponse("Created token key fail.");

  return token;
};

module.exports = AccessService;
