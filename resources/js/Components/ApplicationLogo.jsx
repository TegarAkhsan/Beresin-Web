export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Shadow Circle (Offset) */}
            <circle cx="54" cy="54" r="42" fill="#0F172A" />

            {/* Main Circle */}
            <circle cx="50" cy="50" r="42" fill="#FFC400" stroke="#0F172A" strokeWidth="4" />

            {/* "B." Text */}
            <text
                x="50"
                y="58" // Adjusted for visual vertical centering
                fontSize="48"
                fontWeight="900"
                fontFamily="serif"
                fill="#0F172A"
                textAnchor="middle"
                dominantBaseline="middle" // Not supported in all viewers but good for standard SVG
            >
                B.
            </text>
        </svg>
    );
}
