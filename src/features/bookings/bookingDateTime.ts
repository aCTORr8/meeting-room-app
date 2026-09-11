export const bookingDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
})

export const bookingTimeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: 'short',
})

export function combineDateAndTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`)
}

function padDatePart(value: number): string {
  return value.toString().padStart(2, '0')
}

export function toDateInputValue(date: Date): string {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-')
}

export function toTimeInputValue(date: Date): string {
  return [padDatePart(date.getHours()), padDatePart(date.getMinutes())].join(':')
}
