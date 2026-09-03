export function modifierLabel() {
  if (typeof navigator === "undefined") return "Ctrl"
  return /mac/i.test(navigator.userAgent) ? "⌘" : "Ctrl"
}
