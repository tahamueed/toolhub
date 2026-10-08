export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16 L22 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.25" fill="currentColor" />
      <circle cx="16" cy="4.5" r="1.15" fill="currentColor" />
      <circle cx="27.5" cy="16" r="1.15" fill="currentColor" />
      <circle cx="16" cy="27.5" r="1.15" fill="currentColor" />
      <circle cx="4.5" cy="16" r="1.15" fill="currentColor" />
    </svg>
  );
}
