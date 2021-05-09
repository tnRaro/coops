import { CoopsError } from "./CoopsError";

export class HttpError extends CoopsError {
  private static readonly codeToMessageMap = {
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

  public readonly code: keyof typeof HttpError.codeToMessageMap;
  constructor(code: keyof typeof HttpError.codeToMessageMap, message?: string) {
    super(message ?? HttpError.codeToMessageMap[code]);
    this.code = code;
  }
}
