import type { Box } from "../types.ts";

export class Calendar {
  private db: Deno.Kv;

  public constructor(db: Deno.Kv) {
    this.db = db;
  }

  public async initializeBoxes(count: number): Promise<void> {
    const existingCount = (await this.db.get<number>(["boxesCount"])).value;

    if (existingCount && existingCount === count) {
      console.log("Boxíky již existují. Není potřeba inicializace.");
      return;
    }

    console.log("Inicializuji nové boxy...");
    await this.db.atomic().set(["boxesCount"], count).commit();

    for (let i = 0; i < count; i++) {
      const existingBox = (await this.db.get<Box>(["box", i])).value;

      if (!existingBox) {
        const defaultBox: Box = {
          isOpen: false,
          due: new Date(new Date().getFullYear(), 11, i + 1).toISOString(),
          content: `Box ${i + 1}`,
          type: "text",
        };
        await this.db.set(["box", i], defaultBox);
      }
    }
    console.log("Boxy byly úspěšně inicializovány!");
  }

  public async getBox(index: number): Promise<Box | null> {
    const box = (await this.db.get<Box>(["box", index])).value;
    return box || null;
  }

  public async getAllBoxes(): Promise<Box[]> {
    const count = (await this.db.get<number>(["boxesCount"])).value;
    if (count === null) {
      console.warn("Nebyly nalezeny žádné boxy.");
      return [];
    }

    const boxes: Box[] = [];
    for (let i = 0; i < count; i++) {
      const box = (await this.db.get<Box>(["box", i])).value;
      if (box) boxes.push(box);
    }

    return boxes;
  }

  public async openBox(index: number): Promise<boolean> {
    const box = await this.getBox(index);

    if (!box) {
      console.error("Box neexistuje!");
      return false;
    }

    if (new Date(box.due) > new Date()) {
      console.error("Ještě není čas otevřít tento box!");
      return false;
    }

    if (!box.isOpen) {
      box.isOpen = true;
      await this.db.set(["box", index], box);
      console.log(`Box ${index} byl úspěšně otevřen.`);
      return true;
    } else {
      console.warn("Box už byl otevřen!");
      return false;
    }
  }

  public async updateBox(
    index: number,
    updatedBox: Partial<Box>
  ): Promise<boolean> {
    const box = await this.getBox(index);

    if (!box) {
      console.error("Box neexistuje!");
      return false;
    }

    const updated = { ...box, ...updatedBox };
    await this.db.set(["box", index], updated);
    console.log(`Box ${index} byl úspěšně aktualizován.`);
    return true;
  }
}
