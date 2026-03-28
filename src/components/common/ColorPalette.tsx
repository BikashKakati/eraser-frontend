import React, { useState } from "react";
import { COLORS } from "../../constant";
import { adjustColorBrightness } from "../../utils/colors";

export const ColorPalette: React.FC<{
    icon: React.ElementType,
    label: string,
    onColorSelect: (color: string) => void,
    darkenFactor?: number
}> = ({ icon: Icon, label, onColorSelect, darkenFactor }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex items-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 ${isOpen ? 'bg-slate-200 text-slate-900 shadow-inner' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                title={label}
            >
                <Icon size={18} strokeWidth={2} />
            </button>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`
          absolute bottom-full mb-3 left-1/2 -translate-x-1/2 p-2
          bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/60
          flex items-center gap-2 transition-all duration-200 origin-bottom z-50
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}
        `}
            >
                {COLORS.map(rawColor => {
                    const displayColor = (darkenFactor && rawColor !== 'transparent')
                        ? adjustColorBrightness(rawColor, darkenFactor)
                        : rawColor;

                    return (
                        <button
                            key={rawColor}
                            onClick={() => {
                                onColorSelect(displayColor);
                                setIsOpen(false);
                            }}
                            className="w-6 h-6 rounded-full border border-slate-300 hover:scale-110 active:scale-95 transition-transform shadow-sm"
                            style={{
                                backgroundColor: displayColor === 'transparent' ? '#fff' : displayColor,
                                backgroundImage: displayColor === 'transparent'
                                    ? 'repeating-linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0), repeating-linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0)'
                                    : 'none',
                                backgroundSize: displayColor === 'transparent' ? '8px 8px' : 'auto',
                                backgroundPosition: displayColor === 'transparent' ? '0 0, 4px 4px' : 'auto'
                            }}
                            title={`Set color: ${displayColor}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};
