function padTimeComponent(timeComponent: number): string {
  if (timeComponent < 10) {
    return '0' + timeComponent
  }
  return timeComponent.toString()
}

export function getClockTime(): string {
  const today = new Date()
  const hh = today.getHours()
  const mm = padTimeComponent(today.getMinutes())
  return hh + ':' + mm
}
