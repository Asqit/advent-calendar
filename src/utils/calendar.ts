import type { Box } from "../types.ts";

class Calendar {
  private boxes: Box[] = [];
  private filePath = "./data/boxes.json";

  constructor() {
    this.loadBoxes();
  }

  private async loadBoxes(): Promise<void> {
    try {
      const data = JSON.parse(await Deno.readTextFile(this.filePath));
      if (Array.isArray(data)) {
        this.boxes = data as Box[];
      }
    } catch (error) {
      console.error("Chyba při načítání dat:", error);
    }
  }

  private async saveBoxes(): Promise<void> {
    try {
      await Deno.writeTextFile(this.filePath, JSON.stringify(this.boxes));
    } catch (error) {
      console.error("Chyba při ukládání dat:", error);
    }
  }

  public async openBox(index: number): Promise<boolean> {
    const today = new Date();
    const box = this.boxes[index];

    if (!box) {
      console.error("Box neexistuje!");
      return false;
    }

    if (new Date(box.due) > today) {
      console.error("Ještě není čas na otevření!");
      return false;
    }

    if (!box.isOpen) {
      box.isOpen = true;
      await this.saveBoxes();
      return true;
    }

    console.warn("Box už byl otevřen!");
    return false;
  }

  public getBoxes(): Box[] {
    return [...this.boxes];
  }
}

export default new Calendar();
