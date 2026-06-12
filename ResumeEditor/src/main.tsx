
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Ensure browser tab title (and default PDF filename) is EditorCV
  document.title = "EditorCV";

  createRoot(document.getElementById("root")!).render(<App />);
  