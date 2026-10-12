import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Profile links are always built from the username so they point at the same account
// the stats are fetched from (the stored URL may be a stale or mismatched user entry).
export function leetcodeProfileURL(username?: string): string {
  return username ? `https://leetcode.com/u/${username}/` : 'https://leetcode.com';
}
