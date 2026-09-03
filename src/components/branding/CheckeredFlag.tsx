import type { SVGProps } from "react"

/** Small checkered-flag mark for the Completed archive. */
export function CheckeredFlag({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M6 21V4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6 5h11.5l-1.8 3.5L17.5 12H6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M7.2 6.1h2.3v2.1H7.2zm4.6 0h2.4v2.1h-2.4zM9.5 8.2h2.3v2.1H9.5zm4.6 0H16v2.1h-1.9z"
        fill="currentColor"
      />
    </svg>
  )
}
