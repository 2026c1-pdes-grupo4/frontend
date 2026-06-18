export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init)
  if (!res.ok) {
    const message =
      res.status >= 500 ? 'Server error - please try again later.' :
      res.status === 404 ? 'Resource not found.' :
      res.status === 403 ? 'Access denied.' :
      res.status === 401 ? 'Session expired - please log in again.' :
      `Unexpected error (${res.status}).`
    throw new Error(message)
  }
  return res
}
