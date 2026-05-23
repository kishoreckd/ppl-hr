export function formatDisplayName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function getInitials(name: string) {
  const parts = formatDisplayName(name).split(' ')
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
}
