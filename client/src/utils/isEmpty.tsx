import type { Information } from "../types/types";

export const isEmptyProfile = (obj: Information | null) => {
  if (!obj) return true;
  return Object.values(obj).every((v) => {
    if (typeof v === "string") return v.trim() === "";
    if (Array.isArray(v)) return v.length === 0;
    if (v instanceof Date) return isNaN(v.getTime());
    return true;
  });
};
