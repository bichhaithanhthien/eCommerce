"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 5000;

const countConnections = () => {
  const connectionCounter = mongoose.connections.length;
  console.log(`Number of connections: ${connectionCounter}`);
};

const checkOverload = () => {
  setInterval(() => {
    const connectionCounter = mongoose.connections.length;
    const cpuCoreCounter = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = cpuCoreCounter * 5; // Memo: temporary

    console.log(`Active connections: ${connectionCounter}`);
    console.log(`CPU cores: ${cpuCoreCounter}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (connectionCounter > maxConnections) {
      console.log("Connection overload detected!");
      // TODO: notify.send(...)
    }
  }, _SECONDS);
};

module.exports = {
  countConnections,
  checkOverload,
};
