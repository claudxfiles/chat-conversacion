import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="150"
      height="40"
      viewBox="0 0 150 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="N8N Firebase Interface Logo"
      {...props}
    >
      <rect width="40" height="40" rx="8" fill="hsl(var(--primary))" />
      <text
        x="20"
        y="26"
        fontFamily="Inter, sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="hsl(var(--primary-foreground))"
        textAnchor="middle"
      >
        N8
      </text>
       <text
        x="55"
        y="27"
        fontFamily="Inter, sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        Agent
      </text>
       <text
        x="128"
        y="27"
        fontFamily="Inter, sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="hsl(var(--accent))"
      >
        UI
      </text>
    </svg>
  );
}
