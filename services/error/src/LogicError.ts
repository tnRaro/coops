import { HttpError } from "./HttpError";

type Code = 400 | 401 | 403 | 404 | 409 | 429 | 500 | 501;
export class LogicError extends HttpError {
  private static readonly logicErrorCodes: { [index in Code]: string } = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    429: "Too Many Requests",
    500: "Internal Server",
    501: "Not Implemented",
  };

  constructor(code: Code, message?: string) {
    super(code, message ?? LogicError.logicErrorCodes[code]);
  }
}
