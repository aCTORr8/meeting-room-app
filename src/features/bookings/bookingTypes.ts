import type { Booking } from '../../types'

export type BookingDetails = Omit<Booking, 'id'>
export type BookingEditableFields = Pick<
  Booking,
  'description' | 'endTime' | 'startTime'
>
