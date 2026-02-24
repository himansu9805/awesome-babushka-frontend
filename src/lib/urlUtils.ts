import { DetectedLink } from "@/services/content";

export const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function detectLinksInText(text: string): DetectedLink[] {
  const detectedLinks: DetectedLink[] = [];
  let match: RegExpExecArray | null;

  URL_REGEX.lastIndex = 0; // Reset regex state
  while ((match = URL_REGEX.exec(text)) !== null) {
    detectedLinks.push({
      url: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return detectedLinks;
}

export function buildHighlightedHtml(
  text: string,
  detectedLinks: DetectedLink[],
): string {
  if (detectedLinks.length === 0) return escapeHtml(text);

  let result = "";
  let lastIndex = 0;

  for (const link of detectedLinks) {
    result += escapeHtml(text.slice(lastIndex, link.startIndex));
    result += `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${escapeHtml(link.url)}</a>`;
    lastIndex = link.endIndex;
  }

  result += escapeHtml(text.slice(lastIndex));
  return result.replace(/\n/g, "<br>");
}

export function deduplicateLinks(links: DetectedLink[]): string[] {
  return Array.from(new Set(links.map((link) => link.url)));
}
