const PREFIX = "mapped-madness"

export function storageKey(name: string) {
  return `${PREFIX}.${name}`
}

export function readStorage<T>(name: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(name))
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(name: string, value: T) {
  try {
    localStorage.setItem(storageKey(name), JSON.stringify(value))
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function clearStorage(name: string) {
  try {
    localStorage.removeItem(storageKey(name))
  } catch {
    // Ignore.
  }
}
