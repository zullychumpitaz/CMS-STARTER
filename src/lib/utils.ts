import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name) return "";

  // Separa el nombre por espacios
  const words = name.trim().split(" ");

  if (words.length === 1) {
    // Si es un solo nombre, toma las dos primeras letras
    return words[0].slice(0, 2).toUpperCase();
  }

  // Si hay más de una palabra, toma la primera letra de las dos primeras palabras
  const initials = words[0][0] + words[1][0];
  return initials.toUpperCase();
}