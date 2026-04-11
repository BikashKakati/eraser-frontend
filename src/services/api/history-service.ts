import type { AppNode, CustomEdge } from '../../types';

export interface FlowHistoryState {
    nodes: AppNode[];
    edges: CustomEdge[];
    timestamp?: number;
}

export interface FlowHistoryData {
    past: FlowHistoryState[];
    future: FlowHistoryState[];
}

const HISTORY_STORAGE_PREFIX = "flowbit_history_";

export const HistoryService = {
    getHistory: (flowId: string): FlowHistoryData => {
        try {
            const data = localStorage.getItem(`${HISTORY_STORAGE_PREFIX}${flowId}`);
            return data ? JSON.parse(data) : { past: [], future: [] };
        } catch (e) {
            console.error(`Failed to parse history for flow ${flowId}`, e);
            return { past: [], future: [] };
        }
    },

    saveHistory: (flowId: string, history: FlowHistoryData) => {
        try {
            localStorage.setItem(`${HISTORY_STORAGE_PREFIX}${flowId}`, JSON.stringify(history));
        } catch (e: any) {
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                HistoryService.emergencyGC();
                try {
                    localStorage.setItem(`${HISTORY_STORAGE_PREFIX}${flowId}`, JSON.stringify(history));
                } catch (err) {
                    console.error(`Failed to save history for flow ${flowId} even after GC`, err);
                }
            } else {
                console.error(`Failed to save history for flow ${flowId}`, e);
            }
        }
    },

    emergencyGC: () => {
        const oneHour = 60 * 60 * 1000;
        const now = Date.now();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(HISTORY_STORAGE_PREFIX)) {
                try {
                    const dataStr = localStorage.getItem(key);
                    if (dataStr) {
                        const data: FlowHistoryData = JSON.parse(dataStr);
                        // Filter out past entries older than 1 hr
                        data.past = data.past.filter(item => !item.timestamp || (now - item.timestamp <= oneHour));
                        data.future = data.future.filter(item => !item.timestamp || (now - item.timestamp <= oneHour));
                        localStorage.setItem(key, JSON.stringify(data));
                    }
                } catch (e) {
                    // Ignore parse errors, maybe remove key if corrupt
                    localStorage.removeItem(key);
                }
            }
        }
    },

    clearHistory: (flowId: string) => {
        localStorage.removeItem(`${HISTORY_STORAGE_PREFIX}${flowId}`);
    }
};
