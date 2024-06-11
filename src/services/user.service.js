const UserModel = require("../models/user.model");

class UserService {
  static findOneByEmail = async ({
    email,
    select = {
      email: 1,
      password: 2,
      name: 1,
      status: 1,
      role: 1,
    },
  }) => {
    return await UserModel.findOne({ email }).select(select).lean();
  };
}

module.exports = UserService;
