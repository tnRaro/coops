import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import { UnauthorizedError } from "../errors/UnauthorizedError";
import { CoopsError } from "../errors/CoopsError";
import { HttpError } from "../errors/HttpError";

import { HttpResult } from "./HttpResult";

type ApiHandler<TResult = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<TResult>,
) => Promise<TResult>;
type Method = "GET" | "POST" | "PUT" | "DELETE";
type ApiHandlers = {
  [index in Method]?: ApiHandler;
};
export const apiRouter = (handlers: ApiHandlers): NextApiHandler => {
  return (req, res) => {
    const handler = handlers[req.method as Method];
    if (handler == null) {
      res.setHeader("Allow", Array.from(Object.keys(handlers)));
      res.status(405).end();
      return;
    }
    return handler(req, res)
      .then((data) => {
        if (data == null) {
          res.statusCode = 204;
        }
        if (data instanceof HttpResult) {
          res.status(data.code).send(data.body);
        } else {
          res.send(data);
        }
      })
      .catch((error: CoopsError) => {
        if (error instanceof HttpError) {
          if (error instanceof UnauthorizedError) {
            res.setHeader("WWW-Authenticate", error.realm);
          }
          res.status(error.code).send(error.message);
        } else if (error instanceof HttpResult) {
          // eslint-disable-next-line no-console
          console.error("You should not to throw HttpResult.");
          res.status(500).send("You should not to throw HttpResult.");
        } else {
          // unhandled error
          // eslint-disable-next-line no-console
          console.error(error);
          res.status(500).send(error.message);
        }
      });
  };
};
