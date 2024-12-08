export function stripBetween(
  input: string,
  startDelimiter: string,
  endDelimiter: string
): string {
  const escapedStart = startDelimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex chars
  const escapedEnd = endDelimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // const regex = new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}`, "g"); // Match across lines
  const regex = new RegExp(`<style>(.*)</style>`, "g"); // Match across lines
  console.log("string.helpers | regex", regex);
  return input.replace(regex, "");
}

export function removeStyleTags(input: string): string {
  // Match everything from <style> to </style>, including the tags themselves
  const styleRegex = /<style\b[^>]*>[\s\S]*?<\/style>/gi;

  // Replace all matches with an empty string
  return input.replace(styleRegex, "");
}

export function replaceTabsBySpaces(input: string) {
  return input.replace(/\t/g, "  ");
}
