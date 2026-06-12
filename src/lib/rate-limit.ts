// In-memory sliding window rate limiter (per serverless instance)
// Good enough for abuse prevention; not a distributed counter

interface Bucket {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()

// Prune stale entries every 5 minutes
let lastPrune = Date.now()
function maybePrune() {
  const now = Date.now()
  if (now - lastPrune < 5 * 60 * 1000) return
  lastPrune = now
  for (const [key, bucket] of store) {
    if (bucket.resetAt < now) store.delete(key)
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetIn: number } {
  maybePrune()
  const now = Date.now()
  const bucket = store.get(key)

  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetIn: windowMs }
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetIn: bucket.resetAt - now }
  }

  bucket.count++
  return { allowed: true, remaining: limit - bucket.count, resetIn: bucket.resetAt - now }
}

export function getClientIp(req: Request): string {
  const headers = (req as { headers: Headers }).headers
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  )
}
