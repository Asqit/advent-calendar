// @deno-types="npm:@types/express@^4.17"
import express from "express";
import * as path from "jsr:@std/path";
import compression from "compression";
import cors from "cors";
import { requestLogger } from "./middleware/req-logger.ts";
import api from "./routes.ts";

class Application {
  private app: express.Application;
  private readonly PORT: number = 8000;

  public constructor() {
    this.app = express();
    this.initMiddleware();
  }

  private initMiddleware(): void {
    const router = this.app;

    router.disable("x-powered-by");
    router.use(compression());
    router.use(express.json());
    router.use(express.urlencoded({ extended: false }));
    router.use(requestLogger);
    router.use(cors({ origin: "*" }));
    this.initRoutes();
  }

  private initRoutes(): void {
    this.app.use("/api", api);
    this.app.use(express.static(path.join(Deno.cwd(), "data")));
    this.app.use(express.static(path.join(Deno.cwd(), "public")));
  }

  public listen(): void {
    this.app.listen(this.PORT, () => {
      console.log(`
+---------------------------------------+
|  Success! The service is available
|  http://localhost:${this.PORT}
+---------------------------------------+
      `);
    });
  }
}

export default new Application();
