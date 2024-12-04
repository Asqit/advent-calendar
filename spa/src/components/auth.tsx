import { BASE_URL } from "@/constants";
import { ChangeEvent, useState, FormEvent } from "react";

interface Props {
  setToken(token: string): void;
}

export function Auth({ setToken }: Props) {
  const [value, setValue] = useState<string>("2001-06-24");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setValue(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value.trim()) {
      return;
    }

    const body = JSON.stringify({ validDate: value });
    const result = await fetch(`${BASE_URL}/auth`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body,
    });

    if (!result.ok) {
      return;
    }

    const { token } = await result.json();
    setToken(token);
    location.reload();
  };

  return (
    <div className="w-full h-screen">
      <div className="container mx-auto h-full flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="border rounded-lg p-4">
          <h1 className="text-3xl mt-4">Login</h1>
          <h2 className="mb-2">a login is required to continue</h2>
          <input
            className="border rounded-md w-full my-2"
            type="date"
            onChange={handleChange}
            value={value}
          />
          <button
            className="px-4 py-2 bg-black text-white rounded-lg w-full"
            type="submit"
          >
            login
          </button>
        </form>
      </div>
    </div>
  );
}
