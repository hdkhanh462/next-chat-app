export function getFirstLetters(str?: string, maxLength: number = 2) {
  return str
    ?.trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, maxLength);
}
