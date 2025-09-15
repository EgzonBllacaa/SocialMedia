export const Backend = (() => {
  if (
    import.meta.env.VITE_BACKEND_URL &&
    import.meta.env.VITE_BACKEND_URL !== "undefined"
  ) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  return "http://localhost:4000";
})();
