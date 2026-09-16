/** Formats a number as Indian Rupees, matching the Stitch design's ₹1,750 style. */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
