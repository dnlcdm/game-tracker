export const enableMocking = async () => {
  if (import.meta.env.VITE_ENVIRONMENT !== "dev") {
    return;
  }

  const { worker } = await import("../mocks/browser.ts");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
};
