import React, { useEffect, useRef } from 'react';
import type { EditableTextProps } from '../../types';

const EditableText: React.FC<EditableTextProps> = ({
    initialText,
    onSave,
    onCancel,
    isEditing,
    className = '',
    style = {},
}) => {
    const editableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && editableRef.current) {
            editableRef.current.focus();
            // Move cursor to end
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(editableRef.current);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, [isEditing]);

    const handleBlur = () => {
        if (isEditing) {
            onSave(editableRef.current?.innerText || '');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onCancel?.();
        }
        e.stopPropagation();
    };

    if (!isEditing) {
        return (
            <div className={`whitespace-pre-wrap break-words text-center px-2 select-none pointer-events-none ${className}`} style={style}>
                {initialText}
            </div>
        );
    }

    return (
        <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`outline-none whitespace-pre-wrap break-words text-center px-2 w-full max-h-full overflow-hidden ${className}`}
            style={{
                ...style,
                minWidth: '20px',
                cursor: 'text',
            }}
        >
            {initialText}
        </div>
    );
};

export default EditableText;
