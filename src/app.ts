// @deno-types="npm:@types/express@^4.17"
import express from "express";
import * as path from "jsr:@std/path";
import compression from "compression";
import cors from "cors";
import { requestLogger } from "./middleware/req-logger.ts";
import { Calendar } from "./utils/calendar.ts";
const kv = await Deno.openKv();

class Application {
  private app: express.Application;
  private readonly PORT: number = 8000;
  private calendar = new Calendar(kv);

  public constructor() {
    this.app = express();
    this.init();
  }

  private async init() {
    await this.calendar.initializeBoxes(23);
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
    const router = this.app;

    router.get("/api/", (_req, res) => {
      res.sendStatus(200);
    });

    router.get("/api/box/", async (_req, res) => {
      res.status(200).json({ data: await this.calendar.getAllBoxes() });
    });

    router.get("/api/box/:id", async (req, res) => {
      res.status(200).json(await this.calendar.getBox(+req.params.id!));
    });

    router.patch("/api/box/:id", async (req, res) => {
      const { id } = req.params;
      const { data } = req.body;

      const ok = await this.calendar.updateBox(+id, data);
      if (!ok) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });

    router.put("/api/box/:id", async (req, res) => {
      const { id } = req.params;
      const ok = await this.calendar.openBox(+id);

      if (!ok) {
        res.sendStatus(500);
        return;
      }

      res.status(200).json({ data: await this.calendar.getAllBoxes() });
    });

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
