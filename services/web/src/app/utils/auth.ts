import { NextApiRequest } from "next";

import { UnauthorizedError } from "../errors/UnauthorizedError";

export const auth = (req: NextApiRequest, realm: string) => {
  if (req.headers.authorization == null) {
    throw new UnauthorizedError(realm);
  }
  const [method, authorId] = req.headers.authorization.split(/\s+/);
  if (method !== "X-API-KEY") {
    throw new UnauthorizedError(realm);
  }
  return authorId;
};
