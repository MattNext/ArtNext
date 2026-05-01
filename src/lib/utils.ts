import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// laver initialer ud fra et navn, som så bruges til ens avatar (hvis det ingen profilbilled er)
export function getInitials(name: string): string {
  return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
}