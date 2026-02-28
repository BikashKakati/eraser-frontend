
export type Tool = 'select' | 'rectangle' | 'circle' | 'arrow' | 'pan_zoom';

export type ActiveToolStoreType = {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
};