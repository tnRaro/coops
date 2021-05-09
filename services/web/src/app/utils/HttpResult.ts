export class HttpResult {
  private static readonly codeToMessageMap = {
    200: "OK",
    201: "Created",
  };

  public readonly code: keyof typeof HttpResult.codeToMessageMap;
  public readonly body: any;
  constructor(body: any, code: keyof typeof HttpResult.codeToMessageMap = 200) {
    this.body = body;
    this.code = code;
  }
}
