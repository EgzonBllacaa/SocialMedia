import type { Information } from "../types/types";

function isDate(value: unknown): value is Date {
  return Object.prototype.toString.call(value) === "[object Date]";
}

export const isEmptyProfile = (obj: Information | null) => {
  if (!obj) return true;

  return Object.values(obj).every((v) => {
    if (v === null || v === undefined) return true;
    if (typeof v === "string") return v.trim() === "";
    if (Array.isArray(v)) return v.length === 0;
    if (isDate(v)) return isNaN(v.getTime());
    return true;
  });
};
