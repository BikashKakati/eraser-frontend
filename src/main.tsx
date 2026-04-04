import "@xyflow/react/dist/style.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Flowbit.css";
import FlowbitApp from "./FlowbitApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlowbitApp />
  </StrictMode>
);
