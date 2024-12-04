// @deno-types="npm:@types/jsonwebtoken"
import jwt, { JwtPayload } from "npm:jsonwebtoken";

// @deno-types="npm:@types/express@^4.17"
import { Request, Response, NextFunction } from "express";
import { AUTH_TOKEN_SECRET } from "../constants.ts";

export function authorize(req: Request, res: Response, next: NextFunction) {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    console.log("no token");
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, AUTH_TOKEN_SECRET) as JwtPayload;

    if (!decoded.validDate) {
      console.log("no valid date", decoded);
      throw new Error();
    }

    if (
      new Date(decoded?.validDate).getTime() !==
      new Date("2024-12-05").getTime()
    ) {
      console.log("invalid payload");
      throw new Error();
    }

    next();
  } catch {
    console.log("failed to decode");
    res.sendStatus(401);
  }
}
