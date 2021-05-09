import { NextApiRequest, NextApiResponse } from "next";

import apiHandler from "./index";

describe("/rooms/TEST53", () => {
  test("It should response with 401 Unauthorized", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        roomId: "TEST53",
      },
    });
    await apiHandler(req, res);
    expect(res.statusCode).toBe(401);
  });
  test("It should response with 404 Unauthorized", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {
        roomId: "TEST53",
      },
      headers: {
        authorization: "X-API-KEY 00000000-0000-0000-0000-000000000000",
      },
    });
    await apiHandler(req, res);
    expect(res.statusCode).toBe(404);
  });
});
