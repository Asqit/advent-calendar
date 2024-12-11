// @deno-types="npm:@types/express@^4.17"
import express from "express";
import * as path from "jsr:@std/path";
import compression from "compression";
import cors from "cors";

// @deno-types="npm:@types/jsonwebtoken"
import jwt from "npm:jsonwebtoken";

import { requestLogger } from "./middleware/req-logger.ts";
import { authorize } from "./middleware/authorize.ts";
import { Calendar } from "./utils/calendar.ts";
import { AUTH_TOKEN_SECRET } from "./constants.ts";
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

    router.post("/api/box", async (req, res) => {
      const newBox = await this.calendar.addBox({ ...req.body });
      if (!newBox) res.sendStatus(500);
      res.sendStatus(201);
    });

    router.get("/api/", (_req, res) => {
      res.sendStatus(200);
    });

    router.post("/auth", (req, res) => {
      const { validDate } = req.body;

      if (!validDate) {
        res.sendStatus(400);
        return;
      }

      if (new Date(validDate).getTime() !== new Date("2024-12-05").getTime()) {
        res.sendStatus(401);
        return;
      }

      const token = jwt.sign({ validDate }, AUTH_TOKEN_SECRET);
      res.status(201).json({ token });
    });

    router.get("/api/box/", authorize, async (_req, res) => {
      res.status(200).json({ data: await this.calendar.getAllBoxes() });
    });

    router.get("/api/box/:id", authorize, async (req, res) => {
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

    router.put("/api/box/:id", authorize, async (req, res) => {
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
      \r--------------------------------------------------------------
      \r Good news, everyone: 
      \r The REST API is now available at http://localhost:${this.PORT}
      \r--------------------------------------------------------------
      `);
    });
  }
}

export default new Application();
