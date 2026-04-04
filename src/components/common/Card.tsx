import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hoverEffect = false,
    ...props
}) => {
    const baseStyles = "bg-slate-900/50 border border-slate-800 rounded-2xl";
    const hoverStyles = hoverEffect
        ? "hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-slate-800/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-indigo-500/10 transition-all duration-300"
        : "";

    return (
        <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
            {children}
        </div>
    );
};
