/** Generates an order reference like "FRU-84920", matching the Stitch success modal. */
export function generateOrderNumber(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `FRU-${random}`;
}

/** Formats an ISO timestamp for admin tables, e.g. "14 Sep 2026, 6:45 PM". */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
