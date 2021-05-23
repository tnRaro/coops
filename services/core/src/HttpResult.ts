type Code = 200 | 201;
export class HttpResult {
  private static readonly codeToMessageMap: { [index in Code]: string } = {
    200: "OK",
    201: "Created",
  };

  public readonly code: Code;
  public readonly body: any;
  constructor(body: any, code: Code = 200) {
    this.body = body ?? HttpResult.codeToMessageMap[code];
    this.code = code;
  }
}
