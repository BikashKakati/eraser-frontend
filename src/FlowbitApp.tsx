import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import MainCanvas from "./components/main-canvas/MainCanvas";
import { ReactFlowProvider } from "@xyflow/react";


const FlowbitApp: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-50 to-indigo-50"
      style={{
        backgroundImage: `
          linear-gradient(to bottom right, var(--tw-gradient-stops)),
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 24px 24px, 24px 24px',
        backgroundColor: '#f8fafc'
      }}
    >
      <ReactFlowProvider>
        <Sidebar />
        <MainCanvas />
      </ReactFlowProvider>
    </div>
  );
};

export default FlowbitApp;
