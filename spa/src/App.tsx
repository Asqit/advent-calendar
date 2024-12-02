import { useEffect, useState } from "react";
import { Snow } from "./components/snow.tsx";
import { Box as BoxType } from "./types.ts";
import { Box } from "./components/box.tsx";

export default function App() {
  const [boxes, setBoxes] = useState<BoxType[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000/api/box/");
      if (!response.ok) return;

      const data = await response.json();
      setBoxes(data?.data);
    })();
  }, []);

  return (
    <div className="w-full min-h-screen relative">
      <Snow />
      <div className="container mx-auto max-w-screen-lg h-full flex flex-col justify-center p-4 md:p-0">
        <h1 className="text-4xl font-bold text-center mb-8 text-red-600">
          Vánoční Adventní Kalendář
        </h1>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {boxes.map((box, i) => (
            <Box data={box} index={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
