export function delay(ms?: number): Promise<void> {
  const jitter = ms ?? 200 + Math.random() * 200
  return new Promise((resolve) => setTimeout(resolve, jitter))
}
