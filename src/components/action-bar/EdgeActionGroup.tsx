import React from 'react';
import { Trash2, PenLine } from 'lucide-react';
import { useEditorStore } from '../../store/editor-store';
import { ColorPalette } from '../common/ColorPalette';

const EdgeActionGroup: React.FC<{ edgeIds: string[] }> = ({ edgeIds }) => {
    const { updateEdgeStyle, deleteElements } = useEditorStore()

    const handleColor = (color: string) => {
        edgeIds.forEach(id => updateEdgeStyle(id, { arrowColor: color }));
    };

    const handleDelete = () => {
        deleteElements(edgeIds, 'edge');
    };

    return (
        <div className="flex items-center gap-1">
            <ColorPalette icon={PenLine} label="Stroke Color" onColorSelect={handleColor} darkenFactor={0.8} />

            <div className="w-[1px] h-6 bg-slate-200 mx-1" />

            <button
                onClick={handleDelete}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150"
                title="Delete Edge(s)"
            >
                <Trash2 size={18} strokeWidth={2} />
            </button>
        </div>
    );
};

export default EdgeActionGroup;
