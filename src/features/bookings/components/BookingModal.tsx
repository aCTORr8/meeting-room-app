import { useCallback, useEffect, useState } from 'react'
import { ErrorAlert } from '../../../components/ui/ErrorAlert'
import { Modal } from '../../../components/ui/Modal'
import type { Booking, Room } from '../../../types'
import {
  createBooking,
  deleteBooking,
  getRoomBookings,
  updateBooking,
} from '../bookingService'
import type { BookingEditableFields } from '../bookingTypes'
import { BookingForm } from './BookingForm'
import { BookingList } from './BookingList'

interface BookingModalProps {
  currentUserId?: string
  isOpen: boolean
  onClose: () => void
  room: Room | null
}

export function BookingModal({
  currentUserId,
  isOpen,
  onClose,
  room,
}: BookingModalProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [bookingBeingEdited, setBookingBeingEdited] = useState<Booking | null>(
    null,
  )
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(
    null,
  )
  const [listError, setListError] = useState('')
  const roomId = room?.id

  const loadBookings = useCallback(async () => {
    if (!roomId) {
      setBookings([])
      return
    }

    setIsLoading(true)
    setListError('')

    try {
      setBookings(await getRoomBookings(roomId))
    } catch {
      setListError('Unable to load bookings for this room.')
    } finally {
      setIsLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    if (isOpen) {
      void loadBookings()
    }
  }, [isOpen, loadBookings])

  useEffect(() => {
    setBookingBeingEdited(null)
  }, [isOpen, roomId])

  if (!room) {
    return null
  }

  const handleSaveBooking = async ({
    description,
    endTime,
    startTime,
  }: BookingEditableFields) => {
    if (!currentUserId) {
      throw new Error('You must be signed in to create a booking.')
    }

    if (bookingBeingEdited) {
      if (bookingBeingEdited.userId !== currentUserId) {
        throw new Error('You can only edit your own bookings.')
      }

      await updateBooking(bookingBeingEdited, {
        description,
        endTime,
        startTime,
      })
      setBookingBeingEdited(null)
    } else {
      await createBooking({
        description,
        endTime,
        roomId: room.id,
        startTime,
        userId: currentUserId,
      })
    }

    await loadBookings()
  }

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingBookingId(bookingId)
    setListError('')

    try {
      await deleteBooking(bookingId)
      setBookingBeingEdited((currentBooking) =>
        currentBooking?.id === bookingId ? null : currentBooking,
      )
      await loadBookings()
    } catch {
      setListError('Unable to cancel the booking.')
    } finally {
      setCancellingBookingId(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${room.name}`}>
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Current bookings
        </h3>
        {listError && <ErrorAlert className="mt-3" message={listError} />}
        <div className="mt-3 max-h-56 overflow-y-auto">
          <BookingList
            bookings={bookings}
            cancellingBookingId={cancellingBookingId}
            currentUserId={currentUserId}
            editingBookingId={bookingBeingEdited?.id ?? null}
            isLoading={isLoading}
            onCancel={handleCancelBooking}
            onEdit={setBookingBeingEdited}
          />
        </div>
      </section>

      <div className="mt-6 border-t border-slate-100 pt-6">
        <BookingForm
          defaultValues={
            bookingBeingEdited
              ? {
                  description: bookingBeingEdited.description,
                  endTime: bookingBeingEdited.endTime,
                  startTime: bookingBeingEdited.startTime,
                }
              : undefined
          }
          key={bookingBeingEdited?.id ?? 'new-booking'}
          onCancel={
            bookingBeingEdited
              ? () => setBookingBeingEdited(null)
              : undefined
          }
          onSubmit={handleSaveBooking}
        />
      </div>
    </Modal>
  )
}
