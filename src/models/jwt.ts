function parsePayload(token: string | null): Record<string, unknown> | null {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function extractRole(token: string | null): string | null {
  return (parsePayload(token)?.roles as string[])?.[0] ?? null
}

export function extractId(token: string | null): number | null {
  const id = parsePayload(token)?.id
  return typeof id === 'number' ? id : null
}
