import { UnauthorizedError } from "@coops/error";
import { NextApiRequest } from "next";

export const auth = (req: NextApiRequest, realm: string) => {
  if (req.headers.authorization == null) {
    throw new UnauthorizedError(realm);
  }
  const [method, authorId] = req.headers.authorization.split(/\s+/);
  if (method !== "X-API-KEY") {
    throw new UnauthorizedError(realm);
  }
  if (authorId == null) {
    throw new UnauthorizedError(realm);
  }
  return authorId;
};
