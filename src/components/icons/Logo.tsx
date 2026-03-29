

interface LogoProps {
    className?: string;
}

export function FlowbitLogo({ className = "w-8 h-8" }: LogoProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            className={className}
        >
            <defs>
                <linearGradient id="indigoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
            </defs>

            <g id="Logo_Group">
                <path
                    d="
                    M 125 400
                       C 125 350, 125 300, 125 150
                       C 125 100, 150 75, 200 75
                       L 375 75
                       L 325 50
                       M 375 75
                       L 325 100
                       M 125 225
                       L 275 225
                       L 250 200
                       M 275 225
                       L 250 250
                    "
                    stroke="url(#indigoGradient)"
                    strokeWidth="30"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />

                <circle cx="125" cy="400" r="40" stroke="url(#indigoGradient)" strokeWidth="25" fill="none" />
            </g>
        </svg>
    );
}
