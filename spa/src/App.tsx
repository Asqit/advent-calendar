import { Snow } from "./components/snow.tsx";
import { Box as BoxType } from "./types.ts";
import { Box } from "./components/box.tsx";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./constants.ts";

async function fetchBoxes() {
  const response = await fetch(`${BASE_URL}/api/box/`);

  if (!response.ok) throw new Error("Network Error");

  return (await response.json())?.data;
}

export default function App() {
  const { data, isError, isLoading } = useQuery<BoxType[]>({
    queryFn: fetchBoxes,
    queryKey: ["boxes"],
  });

  if (isLoading) {
    return <>loading...</>;
  }

  if (isError) {
    return <>Error!</>;
  }

  return (
    <div className="w-full min-h-screen relative">
      <Snow />
      <div className="container mx-auto max-w-screen-lg h-full flex flex-col justify-center p-4 md:p-0">
        <h1 className="text-4xl font-bold text-center mb-8 text-red-600">
          Vánoční Adventní Kalendář
        </h1>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {data?.map((box, i) => (
            <Box key={+new Date(box.due)} data={box} index={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
