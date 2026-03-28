import { PaintBucket, Pen, Trash2 } from 'lucide-react';
import React from 'react';
import { useEditorStore } from '../../store/editor-store';
import { ColorPalette } from '../common/ColorPalette';

const NodeActionGroup: React.FC<{ nodeIds: string[] }> = ({ nodeIds }) => {
    const { updateShapeNode, deleteElements } = useEditorStore();

    const handleBgColor = (color: string) => {
        nodeIds.forEach(id => updateShapeNode(id, { bgColor: color }));
    };

    const handleBorderColor = (color: string) => {
        nodeIds.forEach(id => updateShapeNode(id, { borderColor: color }));
    };

    const handleDelete = () => {
        deleteElements(nodeIds, 'node');
    };

    return (
        <div className="flex items-center gap-1">
            <ColorPalette icon={PaintBucket} label="Fill Color" onColorSelect={handleBgColor} />
            <ColorPalette icon={Pen} label="Border Color" onColorSelect={handleBorderColor} darkenFactor={0.8} />

            <div className="w-[1px] h-6 bg-slate-200 mx-1" />

            <button
                onClick={handleDelete}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150"
                title="Delete Node(s)"
            >
                <Trash2 size={18} strokeWidth={2} />
            </button>
        </div>
    );
};

export default NodeActionGroup;
