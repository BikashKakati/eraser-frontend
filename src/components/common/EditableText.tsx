import React, { useEffect, useRef } from 'react';
import type { EditableTextProps } from '../../types';

const EditableText: React.FC<EditableTextProps> = ({
    initialText,
    onSave,
    onCancel,
    isEditing,
    className = '',
    style = {},
    onContentSizeChange,
}) => {
    const editableRef = useRef<HTMLDivElement>(null);

    const reportSize = React.useCallback(() => {
        if (onContentSizeChange && editableRef.current) {
            onContentSizeChange({
                width: editableRef.current.scrollWidth,
                height: editableRef.current.scrollHeight
            });
        }
    }, [onContentSizeChange]);

    useEffect(() => {
        if (!editableRef.current) return;

        const observer = new ResizeObserver(() => {
            reportSize();
        });

        observer.observe(editableRef.current);
        // Initial report
        reportSize();

        return () => observer.disconnect();
    }, [reportSize, isEditing]);

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

    const handleInput = () => {
        reportSize();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onCancel?.();
        }
        e.stopPropagation();
    };

    if (!isEditing) {
        return (
            <div
                ref={editableRef}
                className={`whitespace-pre-wrap break-words text-center px-2 select-none pointer-events-none w-full ${className}`}
                style={{ ...style, height: 'fit-content' }}
            >
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
            onInput={handleInput}
            className={`outline-none whitespace-pre-wrap break-words text-center px-2 w-full overflow-hidden ${className}`}
            style={{
                ...style,
                minWidth: '10px',
                height: 'fit-content',
                cursor: 'text',
            }}
        >
            {initialText}
        </div>
    );
};

export default EditableText;
