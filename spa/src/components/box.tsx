import { Box as BoxType } from "../types.ts";
import { Card } from "./ui/card.tsx";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog.tsx";
import { match } from "ts-pattern";
import classNames from "classnames";
import { useMutation } from "@tanstack/react-query";
import { queryClient, BASE_URL } from "@/constants.ts";
import {
  CloudSnowIcon as Snow,
  Gift,
  TreesIcon as Tree,
  Candy,
  Bell,
  Star,
  Coffee,
  Music,
  Loader,
} from "lucide-react";
import { useReadLocalStorage } from "usehooks-ts";

interface Props {
  data: BoxType;
  index: number;
}

const icons = [
  <Tree />,
  <Gift />,
  <Candy />,
  <Bell />,
  <Star />,
  <Coffee />,
  <Music />,
  <Snow />,
];

async function handleOpen(index: number, token: string) {
  const response = await fetch(`${BASE_URL}/api/box/${index - 1}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "PUT",
  });

  return await response.json();
}

export function Box({ data, index }: Props) {
  const token = useReadLocalStorage("auth");
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: () => handleOpen(index, token as string),
    onSuccess() {
      console.log("success!");
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
    },
  });

  const Icon = icons[Math.floor(Math.random() * icons.length)];
  const { due, content, type, isOpen } = data;
  const date = new Date(due);

  return (
    <Dialog key={+new Date(due)}>
      <DialogTrigger asChild>
        <Card
          onClick={async () => {
            if (!isOpen) {
              await mutateAsync();
            }
          }}
          className={classNames(
            "h-24 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
            isOpen ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600",
            date > new Date() ? "bg-red-300" : "",
          )}
        >
          <span className="text-2xl font-bold mb-2">
            {index} {Icon}
          </span>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-green-50 border-2 border-red-500">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-2">
            {Icon}
            Den {new Date(due).getDay() + 1}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 text-center">
          {isPending ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          ) : isOpen || isSuccess ? (
            <Body type={type} content={content} />
          ) : (
            <div>
              <h2 className="text-xl">👎</h2>
              <p>Ještě není ten správný čas!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface BodyProps {
  type: BoxType["type"];
  content: string;
}

function Body({ type, content }: BodyProps) {
  return match(type)
    .with("text", () => <p>{content}</p>)
    .with("image", () => {
      if (content.split("").includes(";")) {
        const bits = content.split(";");
        const url = bits[0];
        const caption = bits[1];

        return (
          <div>
            <img src={`${url}`} />
            <p>{caption}</p>
          </div>
        );
      }

      return <img src={content} />;
    })
    .with("audio", () => <audio src={content} />)
    .exhaustive();
}
