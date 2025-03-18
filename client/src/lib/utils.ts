import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHostnameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    // Return just the url if it's not valid
    return url;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function calculateWeightedScore(factors: Array<{ score: number; weight: number }>): number {
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  const weightedSum = factors.reduce(
    (sum, factor) => sum + (factor.score * factor.weight) / 100,
    0
  );
  return Math.round((weightedSum / totalWeight) * 100);
}
