import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'
import type { Booking } from '../../../types'
import {
  bookingDateFormatter,
  bookingTimeFormatter,
} from '../bookingDateTime'

interface BookingListProps {
  bookings: Booking[]
  cancellingBookingId: string | null
  currentUserId?: string
  editingBookingId: string | null
  isLoading: boolean
  onCancel: (bookingId: string) => void | Promise<void>
  onEdit: (booking: Booking) => void
}

export function BookingList({
  bookings,
  cancellingBookingId,
  currentUserId,
  editingBookingId,
  isLoading,
  onCancel,
  onEdit,
}: BookingListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner label="Loading bookings" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-slate-500">
        No bookings have been scheduled.
      </p>
    )
  }

  return (
    <ul>
      {bookings.map((booking) => (
        <li
          className={`mb-3 flex flex-col rounded-xl border bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between ${
            editingBookingId === booking.id
              ? 'border-indigo-300 ring-2 ring-indigo-100'
              : 'border-slate-100'
          }`}
          key={booking.id}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700">
              {bookingDateFormatter.format(booking.startTime)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {bookingTimeFormatter.format(booking.startTime)} –{' '}
              {bookingTimeFormatter.format(booking.endTime)}
            </p>
            <p className="mt-1 line-clamp-2 break-words text-xs text-slate-500">
              {booking.description}
            </p>
          </div>
          {booking.userId === currentUserId && (
            <div className="mt-2 flex shrink-0 items-center gap-3 sm:mt-0">
              <button
                className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={cancellingBookingId === booking.id}
                onClick={() => onEdit(booking)}
                type="button"
              >
                Edit
              </button>
              <button
                className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={cancellingBookingId === booking.id}
                onClick={() => void onCancel(booking.id)}
                type="button"
              >
                {cancellingBookingId === booking.id
                  ? 'Cancelling...'
                  : 'Cancel'}
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
