import React from 'react';

interface BrandMarkProps {
  compact?: boolean;
  inverted?: boolean;
}

/** Minimal geometric wordmark for TechStore hardware storefront. */
export const BrandMark: React.FC<BrandMarkProps> = ({
  compact = false,
  inverted = false,
}) => {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1"
          y="1"
          width="24"
          height="24"
          rx="4"
          className={inverted ? 'fill-zinc-100' : 'fill-foreground'}
        />
        <rect
          x="6"
          y="6"
          width="6"
          height="6"
          rx="1"
          className={inverted ? 'fill-zinc-900' : 'fill-background'}
        />
        <rect
          x="14"
          y="6"
          width="6"
          height="6"
          rx="1"
          className="fill-accent"
        />
        <rect
          x="6"
          y="14"
          width="14"
          height="6"
          rx="1"
          className={inverted ? 'fill-zinc-900' : 'fill-background'}
        />
      </svg>
      <span className="flex items-baseline gap-2">
        <span
          className={`font-display text-sm font-bold tracking-[0.14em] uppercase ${
            inverted ? 'text-zinc-100' : 'text-foreground'
          }`}
        >
          TechStore
        </span>
        {!compact && (
          <span
            className={`hidden sm:inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase ${
              inverted
                ? 'border-zinc-700 text-zinc-400'
                : 'border-border bg-secondary text-muted-foreground'
            }`}
          >
            SUT·01
          </span>
        )}
      </span>
    </span>
  );
};
