export function bytesToMegabytes(bytes: number) {
  const megabytes = bytes / 1024 / 1024
  return Math.round(megabytes * 10) / 10
}
