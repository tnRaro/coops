import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import { CoopsError } from "../errors/CoopsError";
import { HttpError } from "../errors/HttpError";

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
    handler(req, res)
      .then((data) => {
        if (data == null) {
          res.statusCode = 204;
        }
        res.send(data);
      })
      .catch((error: CoopsError) => {
        if (error instanceof HttpError) {
          res.status(error.code).send(error.message);
        } else {
          // unhandled error
          // eslint-disable-next-line no-console
          console.error(error);
          res.status(500).send(error.message);
        }
      });
  };
};
