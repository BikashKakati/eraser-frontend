
export type Tool = 'select' | 'rectangle' | 'circle' | 'arrow' | 'pan';

export type ActiveToolStoreType = {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
};