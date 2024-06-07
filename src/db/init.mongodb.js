"use strict";
const mongoose = require("mongoose");
const { countConnections } = require("../helpers/connectionChecker.helper");
const {
  db: { host, port, name },
} = require("../configs/server.config");
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });

    mongoose
      .connect(connectString)
      .then(() => {
        console.log("Connected MongoDB successfully");
        countConnections();
      })
      .catch((err) => console.log("Error: ", err));
  }

  static getInstance() {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }
}

const instanceDatabase = Database.getInstance();
module.exports = instanceDatabase;
