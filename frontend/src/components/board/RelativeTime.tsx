"use client";

import { useEffect, useState } from "react";

import { formatRelativeTime } from "@/lib/utils/time";

/**
 * Renders a relative timestamp ("2 hours ago"). The first render (server + client
 * hydration) uses a fixed reference time so markup matches; a mount effect then
 * refreshes it to "now" and keeps it current.
 */
export function RelativeTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState(() => formatRelativeTime(iso));

  useEffect(() => {
    const update = () => setLabel(formatRelativeTime(iso));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [iso]);

  return (
    <time dateTime={iso} title={new Date(iso).toLocaleString()} suppressHydrationWarning>
      {label}
    </time>
  );
}
