import { HttpError } from "./HttpError";

export class LogicError extends HttpError {
  private static readonly logicErrorCodes = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    429: "Too Many Requests",
    500: "Internal Server",
    501: "Not Implemented",
  };

  constructor(code: keyof typeof LogicError.logicErrorCodes, message?: string) {
    super(code, message);
  }
}
