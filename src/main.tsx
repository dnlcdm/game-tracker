import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { enableMocking } from "./mocks/enable-mocking.ts";

enableMocking().then((): void => {
  createRoot(document.getElementById("root") as HTMLElement).render(<App />);
});
