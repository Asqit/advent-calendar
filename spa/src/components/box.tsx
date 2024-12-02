import { useCallback } from "react";
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

interface Props {
  data: BoxType;
  index: number;
}

export function Box({ data, index }: Props) {
  const { due, content, type, isOpen } = data;
  const date = new Date(due);

  const handleOpen = useCallback(async () => {
    const response = await fetch(`/api/api/box/${index - 1}`, {
      method: "PUT",
    });

    if (!response.ok) return;

    const result = await response.json();
    console.log(result);
  }, [index]);

  return (
    <Dialog key={+new Date(due)}>
      <DialogTrigger asChild>
        <Card
          onClick={handleOpen}
          className={classNames(
            "h-24 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
            isOpen ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600",
            date > new Date() ? "opacity-50" : ""
          )}
        >
          <span className="text-2xl font-bold mb-2">{index}</span>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-green-50 border-2 border-red-500">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Den {new Date(due).getDay() + 1}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 text-center">
          {isOpen ? (
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
            <img src={`/api${url}`} />
            <p>{caption}</p>
          </div>
        );
      }

      return <img src={content} />;
    })
    .with("audio", () => <audio src={content} />)
    .exhaustive();
}
