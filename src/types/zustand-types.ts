
export type Tool = 'select' | 'rectangle' | 'circle' | 'arrow' | 'pan';

export type StoreState = {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
};