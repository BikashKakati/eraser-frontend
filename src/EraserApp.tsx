import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import MainCanvas from "./components/main-canvas/MainCanvas";
import { ReactFlowProvider } from "@xyflow/react";


const EraserApp: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <Sidebar />
        <MainCanvas />
      </ReactFlowProvider>
    </div>
  );
};

export default EraserApp;
