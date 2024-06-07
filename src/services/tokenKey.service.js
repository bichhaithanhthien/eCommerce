"use strict";
//const mongoose = require('mongoose');
const TokenKeyModel = require("../models/tokenKey.model");

class TokenKeyService {
  static createOrUpdateTokenKey = async ({ userId, privateKey, token }) => {
    const oldTokenKey = await this.findOneByUserId(userId);

    const filter = { user: userId };
    const update = {
      privateKey,
      token,
      usedToken: oldTokenKey ? [oldTokenKey.token] : [],
    };
    const options = { upsert: true, new: true };

    const tokenKey = await TokenKeyModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return tokenKey || null;
  };

  /*
    MEMO:
      TokenKeyModel.findOne({ user: new mongoose.Types.ObjectId(userId) })
      throw error "Cast to ObjectId failed for value ... (type Object) at path '_id' for model 'TokenKey'
  */
  static findOneByUserId = async (userId) => {
    const result = await TokenKeyModel.find({ user: userId }).lean();
    return result[0];
  };

  static findOneByUsedRefreshToken = async (refreshToken) => {
    return await TokenKeyModel.findOne({
      usedRefreshToken: refreshToken,
    }).lean();
  };

  static findOneByRefreshToken = async (refreshToken, isSimple = true) => {
    let query = TokenKeyModel.findOne({ refreshToken }).lean();
    if (isSimple) {
      query = query.lean();
    }
    return await query;
  };

  static deleteOneById = async (id) => {
    return await TokenKeyModel.deleteOne({ _id: id });
  };

  /*
    MEMO:
      TokenKeyModel.findByIdAndDelete({ user: userId })
      throw error "Cast to ObjectId failed for value ... (type Object) at path '_id' for model 'TokenKey'
  */
  static deleteOneByUserId = async (userId) => {
    const object = await this.findOneByUserId(userId);
    return await this.deleteOneById(object._id);
  };
}

module.exports = TokenKeyService;
