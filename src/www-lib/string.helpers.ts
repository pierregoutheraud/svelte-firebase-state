export function removeStyleTags(input: string): string {
  // Match everything from <style> to </style>, including the tags themselves
  const styleRegex = /<style\b[^>]*>[\s\S]*?<\/style>/gi;

  // Replace all matches with an empty string
  return input.replace(styleRegex, "");
}

export function replaceTabsBySpaces(input: string) {
  return input.replace(/\t/g, "  ");
}
