import { Snow } from "./components/snow.tsx";
import { Box as BoxType } from "./types.ts";
import { Box } from "./components/box.tsx";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./constants.ts";
import { Loader } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { Auth } from "./components/auth.tsx";

async function fetchBoxes(token: string) {
  const response = await fetch(`${BASE_URL}/api/box/`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return (await response.json())?.data;
}

export default function App() {
  const [auth, setAuth] = useLocalStorage("auth", "");
  const { data, isError, isLoading } = useQuery<BoxType[]>({
    queryFn: () => fetchBoxes(auth),
    queryKey: ["boxes"],
  });

  if (!auth || isError) {
    return <Auth setToken={(t) => setAuth(t)} />;
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen p-8 flex items-center justify-center text-6xl">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative">
      <Snow />
      <div className="container mx-auto max-w-screen-lg pt-16 flex flex-col justify-center p-4">
        <h1 className="text-4xl md:text-7xl font-bold text-red-500 drop-shadow-lg mb-8 text-center">
          Vánoční Adventní Kalendář
        </h1>

        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {data?.map((box, i) => (
            <Box key={+new Date(box.due)} data={box} index={i + 1} />
          ))}
        </div>

        <p className="text-white my-4">
          S láskou největší mému lásínkovi, Ondřej ❤️
        </p>
      </div>
    </div>
  );
}
