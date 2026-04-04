import { v4 as uuidv4 } from "uuid";

export interface Space {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

const SPACES_STORAGE_KEY = "flowbit_spaces";

export const SpaceService = {
  getSpaces: (userId: string = "default-user"): Space[] => {
    try {
      const data = localStorage.getItem(SPACES_STORAGE_KEY);
      if (!data) return [];
      const spaces: Space[] = JSON.parse(data);
      return spaces.filter((s) => s.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (e) {
      console.error("Failed to parse spaces from localStorage", e);
      return [];
    }
  },

  createSpace: (name: string, userId: string = "default-user"): Space => {
    const newSpace: Space = {
      id: uuidv4(),
      userId,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const allRaw = localStorage.getItem(SPACES_STORAGE_KEY);
    const allSpaces: Space[] = allRaw ? JSON.parse(allRaw) : [];
    
    allSpaces.push(newSpace);
    localStorage.setItem(SPACES_STORAGE_KEY, JSON.stringify(allSpaces));
    
    return newSpace;
  },

  updateSpace: (id: string, newName: string): Space | null => {
    const allRaw = localStorage.getItem(SPACES_STORAGE_KEY);
    if (!allRaw) return null;
    
    const spaces: Space[] = JSON.parse(allRaw);
    const index = spaces.findIndex(s => s.id === id);
    if (index === -1) return null;

    spaces[index].name = newName;
    spaces[index].updatedAt = Date.now();
    localStorage.setItem(SPACES_STORAGE_KEY, JSON.stringify(spaces));
    return spaces[index];
  },

  deleteSpace: (id: string): boolean => {
    const allRaw = localStorage.getItem(SPACES_STORAGE_KEY);
    if (!allRaw) return false;
    
    let spaces: Space[] = JSON.parse(allRaw);
    const initialLength = spaces.length;
    spaces = spaces.filter(s => s.id !== id);
    
    if (spaces.length !== initialLength) {
      localStorage.setItem(SPACES_STORAGE_KEY, JSON.stringify(spaces));
      return true;
    }
    return false;
  }
};
