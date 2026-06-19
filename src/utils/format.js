// Converts API's "YYYY-MM-DD" to the spec's required "YYYY/MM/DD" display format.
export function formatDate(isoDateString) {
  if (!isoDateString) return "";
  return isoDateString.replaceAll("-", "/");
}

// Formats a number as USD with no decimal digits, en-US style.
// e.g. 1234 -> "$1,234"
export function formatProfit(amount) {
  if (amount === null || amount === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}