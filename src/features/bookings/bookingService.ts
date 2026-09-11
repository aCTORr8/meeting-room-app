import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../config/firestore'
import type { Booking } from '../../types'
import type { BookingDetails, BookingEditableFields } from './bookingTypes'

const bookingsCollection = collection(db, 'bookings')

type StoredBooking = Omit<Booking, 'id' | 'startTime' | 'endTime'> & {
  endTime: Date | Timestamp
  startTime: Date | Timestamp
}

function toDate(value: Date | Timestamp): Date {
  return value instanceof Timestamp ? value.toDate() : value
}

function hasTimeConflict(
  booking: BookingDetails,
  existingBooking: Booking,
): boolean {
  return (
    booking.startTime < existingBooking.endTime &&
    booking.endTime > existingBooking.startTime
  )
}

async function validateBookingAvailability(
  booking: BookingDetails,
  excludedBookingId?: string,
): Promise<void> {
  const existingBookings = await getRoomBookings(booking.roomId)
  const bookingHasConflict = existingBookings.some(
    (existingBooking) =>
      existingBooking.id !== excludedBookingId &&
      hasTimeConflict(booking, existingBooking),
  )

  if (bookingHasConflict) {
    throw new Error('This time slot is already booked.')
  }
}

export async function createBooking(
  data: BookingDetails,
): Promise<Booking> {
  await validateBookingAvailability(data)

  const bookingDocument = await addDoc(bookingsCollection, data)

  return {
    id: bookingDocument.id,
    ...data,
  }
}

export async function updateBooking(
  booking: Booking,
  changes: BookingEditableFields,
): Promise<Booking> {
  const updatedBooking = { ...booking, ...changes }

  await validateBookingAvailability(updatedBooking, booking.id)
  await updateDoc(doc(db, 'bookings', booking.id), changes)

  return updatedBooking
}

export async function deleteBooking(bookingId: string): Promise<void> {
  await deleteDoc(doc(db, 'bookings', bookingId))
}

export async function getRoomBookings(roomId: string): Promise<Booking[]> {
  const bookingsQuery = query(
    bookingsCollection,
    where('roomId', '==', roomId),
  )
  const snapshot = await getDocs(bookingsQuery)

  return snapshot.docs
    .map((bookingDocument) => {
      const data = bookingDocument.data() as StoredBooking

      return {
        ...data,
        id: bookingDocument.id,
        endTime: toDate(data.endTime),
        startTime: toDate(data.startTime),
      }
    })
    .sort(
      (firstBooking, secondBooking) =>
        firstBooking.startTime.getTime() - secondBooking.startTime.getTime(),
    )
}
