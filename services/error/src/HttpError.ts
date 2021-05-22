import { CoopsError } from "./CoopsError";

type Code = 200 | 201 | 400 | 401 | 403 | 404 | 405 | 409 | 429 | 500 | 501;
export class HttpError extends CoopsError {
  private static readonly httpErrorCodes: { [index in Code]: string } = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    409: "Conflict",
    429: "Too Many Requests",
    500: "Internal Server",
    501: "Not Implemented",
  };

  public readonly code: Code;
  constructor(code: Code, message?: string) {
    super(message ?? HttpError.httpErrorCodes[code]);
    this.code = code;
  }
}
