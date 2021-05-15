import { HttpError } from "./HttpError";

export class UnauthorizedError extends HttpError {
  readonly schema: string | null;
  readonly realm: string;
  constructor(description: string, schema?: string, realm?: string) {
    super(401, description);
    this.schema = schema ?? null;
    this.realm = realm ?? description;
  }
}
