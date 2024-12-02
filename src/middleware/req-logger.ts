// @deno-types="npm:@types/express@^4.17"
import type { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const { socket, method, url } = req;
  const { remoteAddress } = socket;

  const base = `METHOD - [${method}]; URL - [${url}]; IP - [${remoteAddress}];`;
  console.log(base);

  res.on("finish", () => {
    console.log(`${base} STATUS - [${res.statusCode}]`);
  });

  next();
}
