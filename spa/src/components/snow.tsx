import { useEffect } from "react";

export function Snow() {
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!ctx || !canvas) return;
    const entities: Entity[] = [];
    for (let i = 0; i < 10; i++) entities.push(new Cloud());

    for (let i = 0; i < 250; i++) {
      entities.push(new Snowflake(canvas.width));
    }

    let now: number = Date.now();
    let prev: number = now;
    let dt: number = now - prev;
    let id: number = 0;

    function loop() {
      now = Date.now();
      dt = Math.min(1, (now - prev) / 1000);

      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      for (const entity of entities) {
        entity.render(ctx!);
        entity.update(dt);
      }

      prev = now;
      id = window.requestAnimationFrame(loop);
    }
    loop();

    const handleResize = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      id="canvas"
      className="-z-10 absolute top-0 left-0 bg-[#1c3075] w-full h-full"
    />
  );
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface Entity {
  update(dt: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}

class Snowflake {
  private speed: number = rand(80, 200);
  private size: number = rand(2, 5);
  private x: number;
  private y: number;
  private xAxis: number = 0;

  public constructor(xAxis: number) {
    this.x = rand(0, xAxis - this.size);
    this.xAxis = xAxis;
    this.y = rand(0, innerHeight);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  public update(delta: number): void {
    this.y += this.speed * delta;
    if (this.y > innerHeight) {
      this.x = rand(0, this.xAxis - this.size);
      this.y = 0;
    }
  }
}

class Cloud {
  private size: number = rand(10, 50);
  private x: number = rand(0, innerWidth);
  private y: number = rand(0, innerHeight - this.size);
  private color: string = "#d3d3d3";
  private speed: number = rand(-50, 50);

  public render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(
      this.x + this.size,
      this.y - this.size,
      this.size,
      Math.PI * 1,
      Math.PI * 2,
    );
    ctx.arc(
      this.x + this.size * 2,
      this.y - this.size,
      this.size,
      Math.PI * 1,
      Math.PI * 2,
    );
    ctx.arc(
      this.x + this.size * 3,
      this.y,
      this.size,
      Math.PI * 1.5,
      Math.PI * 0.5,
    );
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  public update(dt: number) {
    this.x += this.speed * dt;
    if (this.x + this.size * 2 < 0) this.x = innerWidth;
    if (this.x > innerWidth) this.x = 0;
  }
}
