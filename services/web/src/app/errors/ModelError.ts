import { CoopsError } from "./CoopsError";

export class ModelError extends CoopsError {
  private static readonly codeToMessageMap = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    429: "Too Many Requests",
    500: "Internal Server",
    501: "Not Implemented",
  };

  public readonly code: keyof typeof ModelError.codeToMessageMap;
  constructor(
    code: keyof typeof ModelError.codeToMessageMap,
    message?: string,
  ) {
    super(message ?? ModelError.codeToMessageMap[code]);
    this.code = code;
  }
}
