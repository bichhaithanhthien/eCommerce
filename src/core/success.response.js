const {
  REASON_STATUS_CODES,
  STATUS_CODES,
} = require("../constants/responseCode.constant");

class SuccessResponse {
  constructor({
    message,
    status = STATUS_CODES.OK,
    reasonStatusCode = REASON_STATUS_CODES.OK,
    metadata = {},
  }) {
    this.message = message || reasonStatusCode;
    this.status = status;
    this.metadata = metadata;
  }

  send(res) {
    return res.status(this.status).json(this);
  }
}

class OKResponse extends SuccessResponse {
  constructor({ message, metadata, options = {} }) {
    super({ message, metadata });
    this.options = options;
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({
    message,
    status = STATUS_CODES.CREATED,
    reasonStatusCode = REASON_STATUS_CODES.CREATED,
    metadata,
    options = {},
  }) {
    super({ message, status, reasonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = {
  SuccessResponse,
  OKResponse,
  CreatedResponse,
};
