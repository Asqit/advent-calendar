import type { Box } from "../types.ts";
const kv = await Deno.openKv("db");

class Calendar {
  private db = kv;

  /**
   * Načte existující data z Deno KV, pokud existují, nebo vytvoří nové boxy.
   * @param count Počet boxů, které mají být v případě potřeby vytvořeny.
   */
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

  /**
   * Získá konkrétní box podle indexu.
   * @param index Index boxu.
   * @returns Box nebo null, pokud neexistuje.
   */
  public async getBox(index: number): Promise<Box | null> {
    const box = (await this.db.get<Box>(["box", index])).value;
    return box || null;
  }

  /**
   * Získá všechny boxy jako pole.
   * @returns Pole všech boxů.
   */
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

  /**
   * Otevře konkrétní box, pokud je to povolené.
   * @param index Index boxu.
   * @returns True, pokud byl box úspěšně otevřen, jinak False.
   */
  public async openBox(index: number): Promise<boolean> {
    const box = await this.getBox(index);

    if (!box) {
      console.error("Box neexistuje!");
      return false;
    }

    const today = new Date().toISOString().split("T")[0];
    if (box.due > today) {
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

  /**
   * Upraví obsah konkrétního boxu.
   * @param index Index boxu.
   * @param updatedBox Nová data pro box.
   * @returns True, pokud byla úprava úspěšná, jinak False.
   */
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

const cal = new Calendar();
await cal.initializeBoxes(23);
export default cal;
