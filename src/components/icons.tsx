import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={32}
      height={32}
      {...props}
    >
      <path
        fill="currentColor"
        d="M168.3 168.3a88.1 88.1 0 0 1-119.3-29.8l17-17a64.1 64.1 0 0 0 85.3 21.8l17 15zm-33.3-16L124 141.3a40 40 0 0 1-45.3-45.3L67.7 85a64.1 64.1 0 0 0 21.8 85.3l17-17a40.2 40.2 0 0 1 28.5-11.8zm33.4-33.4a40 40 0 0 1-57.1 5.3l-11-11a64.1 64.1 0 0 0 62.4-62.4l11 11a40 40 0 0 1-5.3 57.1zm29.8-119.3a88.1 88.1 0 0 1-29.8 119.3l-15-17a64.1 64.1 0 0 0 21.8-85.3l17-17a88.5 88.5 0 0 1 5.3 0z"
      />
    </svg>
  );
}

export function Smiley(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect width="32" height="32" fill="none" />
            <path d="M9 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
            <path d="M22 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
            <path d="M9 20H23" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
        </svg>

    )
}
