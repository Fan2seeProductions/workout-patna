// Polyfill localStorage for environments where it is defined but incomplete
// (e.g. certain sandbox/preview runtimes that expose the global but not the API).
// This runs server-side only; browsers always have a real localStorage.
export function register() {
  if (
    typeof globalThis.localStorage !== 'undefined' &&
    typeof (globalThis.localStorage as Storage).getItem !== 'function'
  ) {
    const store: Record<string, string> = {}
    ;(globalThis as unknown as Record<string, unknown>).localStorage = {
      getItem:    (key: string) => store[key] ?? null,
      setItem:    (key: string, value: string) => { store[key] = String(value) },
      removeItem: (key: string) => { delete store[key] },
      clear:      () => { Object.keys(store).forEach(k => delete store[k]) },
      get length() { return Object.keys(store).length },
      key:        (index: number) => Object.keys(store)[index] ?? null,
    } satisfies Storage
  }
}
