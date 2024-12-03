// @deno-types="npm:@types/express@^4.17"
import { Router } from "express";
import calendar from "./utils/calendar.ts";

const router = Router();

router.get("/", (_req, res) => {
  res.sendStatus(200);
});

router.get("/box/", async (_req, res) => {
  res.status(200).json({ data: await calendar.getBoxes() });
});

router.put("/box/:id", async (req, res) => {
  const { id } = req.params;
  const ok = await calendar.openBox(+id);

  if (!ok) {
    res.sendStatus(500);
    return;
  }

  res.status(200).json({ data: await calendar.getBoxes() });
});

export default router;
