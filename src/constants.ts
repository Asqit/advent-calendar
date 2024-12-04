/** represents a single day in the 24days of advent */
export interface Box {
  isOpen: boolean;
  due: string;
  content: string;
  type: "text" | "audio" | "image";
}

export const AUTH_TOKEN_SECRET = "7a479391-8017-4e0d-a796-9bb3da23588e";
