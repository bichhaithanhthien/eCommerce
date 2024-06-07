"use strict";
const {
  REASON_STATUS_CODES,
  STATUS_CODES,
} = require("../constants/responseCode.constant");

class ErrorResponse extends Error {
  constructor(
    message = REASON_STATUS_CODES.INTERNAL_SERVER_ERROR,
    status = STATUS_CODES.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.status = status;
  }
}

class BadRequestErrorResponse extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODES.BAD_REQUEST,
    status = STATUS_CODES.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class AuthFailureErrorResponse extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODES.UNAUTHORIZED,
    status = STATUS_CODES.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

class NotFoundErrorResponse extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODES.NOT_FOUND,
    status = STATUS_CODES.NOT_FOUND
  ) {
    super(message, status);
  }
}

class ForbiddenErrorResponse extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODES.FORBIDDEN,
    status = STATUS_CODES.FORBIDDEN
  ) {
    super(message, status);
  }
}

class ConflictErrorResponse extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODES.CONFLICT,
    status = STATUS_CODES.CONFLICT
  ) {
    super(message, status);
  }
}

module.exports = {
  ErrorResponse,
  BadRequestErrorResponse,
  AuthFailureErrorResponse,
  NotFoundErrorResponse,
  ForbiddenErrorResponse,
  ConflictErrorResponse,
};
