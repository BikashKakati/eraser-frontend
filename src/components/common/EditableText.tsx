import React, { useEffect, useRef } from 'react';
import type { EditableTextProps } from '../../types';

const EditableTextArea: React.FC<EditableTextProps> = ({
    initialText,
    onSave,
    onCancel,
    isTextAreaEnabled,
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
    }, [reportSize, isTextAreaEnabled]);

    useEffect(() => {
        if (isTextAreaEnabled && editableRef.current) {
            editableRef.current.focus();
            // Move cursor to end
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(editableRef.current);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, [isTextAreaEnabled]);

    const handleBlur = () => {
        if (isTextAreaEnabled) {
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

    if (!isTextAreaEnabled) {
        return (
            <div
                ref={editableRef}
                className={`whitespace-pre-wrap break-words text-center px-2 select-none pointer-events-none w-fit max-w-full ${className}`}
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
            className={`outline-none whitespace-pre-wrap break-words text-center px-2 w-fit max-w-full overflow-hidden ${className}`}
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

export default EditableTextArea;
