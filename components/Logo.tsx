export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" fill="#0d7a3f" />
      <circle cx="32" cy="32" r="24" fill="#fdf6e3" />
      <path
        d="M14 36 L32 26 L50 36 L32 46 Z"
        fill="#0d7a3f"
        stroke="#075c2f"
        strokeWidth="1.5"
      />
      <rect x="30.5" y="26" width="3" height="14" fill="#d4a017" />
      <circle cx="32" cy="24" r="2.5" fill="#d4a017" />
      <text
        x="32"
        y="56"
        textAnchor="middle"
        fontFamily="ui-serif, Georgia, serif"
        fontSize="6"
        fontWeight="700"
        fill="#075c2f"
      >
        UNKHAIR
      </text>
    </svg>
  );
}
