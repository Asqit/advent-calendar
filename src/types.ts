/** represents a single day in the 24days of advent */
export interface Box {
  isOpen: boolean;
  due: Date;
  content: string;
  type: "text" | "audio" | "image";
}
