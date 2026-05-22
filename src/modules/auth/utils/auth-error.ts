export function getAuthErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Authentication failed. Try again.'
}
