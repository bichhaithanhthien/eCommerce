"use strict";
const { Types, Schema, model } = require("mongoose");

module.exports.model = model;
module.exports.Types = Types;
module.exports.Mixed = Schema.Types.Mixed;
module.exports.ObjectId = Schema.Types.ObjectId;
module.exports.Mixed = Schema.Types.Mixed;
module.exports.Boolean = Schema.Types.Boolean;

module.exports.generate = ({ schema, collectionName, documentName }) => {
  const _schema = new Schema(schema, {
    timestamps: true,
    collection: collectionName,
  });
  return model(documentName, _schema);
};
