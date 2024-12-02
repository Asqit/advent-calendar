import { useEffect } from "react";

export function Snow() {
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!ctx || !canvas) return;
    const snowflakes: Snowflake[] = [];
    for (let i = 0; i < 250; i++) {
      snowflakes.push(new Snowflake(canvas.width));
    }

    let now: number = Date.now();
    let prev: number = now;
    let dt: number = now - prev;
    let id: number = 0;

    function loop() {
      now = Date.now();
      dt = Math.min(1, (now - prev) / 1000);

      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      for (const snowflake of snowflakes) {
        snowflake.update(dt, canvas.height);
        snowflake.render(ctx!);
      }

      prev = now;
      id = window.requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.cancelAnimationFrame(id);
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

  public update(delta: number, yAxis: number): void {
    this.y += this.speed * delta;
    if (this.y > yAxis) {
      this.x = rand(0, this.xAxis - this.size);
      this.y = 0;
    }
  }
}
