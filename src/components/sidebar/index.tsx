import type React from "react";
import { useStore } from "../../store/zustand-store";
import type { Tool } from "../../types/zustand-types";

const Sidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useStore();

  const getButtonClass = (tool: Tool) =>
    `w-full text-left p-3 rounded-lg transition-colors duration-200 ${
      activeTool === tool
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
    }`;

  return (
    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 w-52 z-10 shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Tools</h2>
      <div className="space-y-2">
        <button onClick={() => setActiveTool("select")} className={getButtonClass("select")}>
          Select / Move
        </button>
        <button onClick={() => setActiveTool("rectangle")} className={getButtonClass("rectangle")}>
          Rectangle
        </button>
        <button onClick={() => setActiveTool("circle")} className={getButtonClass("circle")}>
          Circle
        </button>
        <button onClick={() => setActiveTool("arrow")} className={getButtonClass("arrow")}>
          Arrow
        </button>
        <button onClick={() => setActiveTool("pan")} className={getButtonClass("pan")}>
          Pan / Zoom
        </button>
      </div>
    </div>
  );
};

export default Sidebar;