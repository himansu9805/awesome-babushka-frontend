export function formatRelativeTime(dateString: string): string {
  const normalized = dateString.endsWith("Z") ? dateString : `${dateString}Z`;

  const inputDate = new Date(normalized);
  const now = new Date();

  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const diffMs = now.getTime() - inputDate.getTime();

  if (diffMs < 0) {
    return "just now";
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  if (diffDays <= 3) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return inputDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
