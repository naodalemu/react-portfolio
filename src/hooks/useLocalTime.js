import { useEffect, useState } from 'react'

function format(timeZone) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone,
      timeZoneName: 'short',
    }).formatToParts(new Date())
    const get = (type) => parts.find((part) => part.type === type)?.value ?? ''
    // Abbreviation follows daylight saving automatically (EDT / EST).
    return { time: `${get('hour')}:${get('minute')}`, zone: get('timeZoneName') }
  } catch {
    return { time: '', zone: '' }
  }
}

/** Current time and zone abbreviation in an IANA time zone, refreshed on the minute. */
export function useLocalTime(timeZone) {
  const [value, setValue] = useState(() => format(timeZone))

  useEffect(() => {
    if (!timeZone) return
    let interval
    const tick = () => setValue(format(timeZone))
    const timeout = setTimeout(
      () => {
        tick()
        interval = setInterval(tick, 60_000)
      },
      60_000 - (Date.now() % 60_000),
    )
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [timeZone])

  return timeZone ? value : { time: '', zone: '' }
}
