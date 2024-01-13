import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export const parseToArrays = (input: string) => {
  const output = input
    .split("\n")
    .filter((line) => line.length > 0 || !line.startsWith("Sure"))
    .map((line) => {
      return line
        .replace("- ", "")
        .replace(/[0-9]./, "")
        .trim();
    });

  return output;
};
