import { useState, type FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { ErrorAlert } from '../../../components/ui/ErrorAlert'
import { Input } from '../../../components/ui/Input'
import {
  combineDateAndTime,
  toDateInputValue,
  toTimeInputValue,
} from '../bookingDateTime'
import type { BookingEditableFields } from '../bookingTypes'

interface BookingFormProps {
  defaultValues?: BookingEditableFields
  onCancel?: () => void
  onSubmit: (submission: BookingEditableFields) => Promise<void>
}

export function BookingForm({
  defaultValues,
  onCancel,
  onSubmit,
}: BookingFormProps) {
  const [date, setDate] = useState(() =>
    defaultValues ? toDateInputValue(defaultValues.startTime) : '',
  )
  const [startTime, setStartTime] = useState(() =>
    defaultValues ? toTimeInputValue(defaultValues.startTime) : '',
  )
  const [endTime, setEndTime] = useState(() =>
    defaultValues ? toTimeInputValue(defaultValues.endTime) : '',
  )
  const [description, setDescription] = useState(
    () => defaultValues?.description ?? '',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const bookingStart = combineDateAndTime(date, startTime)
    const bookingEnd = combineDateAndTime(date, endTime)

    if (
      Number.isNaN(bookingStart.getTime()) ||
      Number.isNaN(bookingEnd.getTime())
    ) {
      setSubmissionError('Select a valid date and time range.')
      return
    }

    if (bookingEnd <= bookingStart) {
      setSubmissionError('End time must be later than start time.')
      return
    }

    setIsSubmitting(true)
    setSubmissionError('')

    try {
      await onSubmit({
        description: description.trim(),
        endTime: bookingEnd,
        startTime: bookingStart,
      })

      if (!defaultValues) {
        setDate('')
        setStartTime('')
        setEndTime('')
        setDescription('')
      }
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : `Unable to ${defaultValues ? 'update' : 'create'} the booking.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {defaultValues ? 'Edit booking' : 'New booking'}
      </h3>
      <Input
        label="Date"
        onChange={(event) => setDate(event.target.value)}
        required
        type="date"
        value={date}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Start Time"
          onChange={(event) => setStartTime(event.target.value)}
          required
          type="time"
          value={startTime}
        />
        <Input
          label="End Time"
          onChange={(event) => setEndTime(event.target.value)}
          required
          type="time"
          value={endTime}
        />
      </div>
      <Input
        label="Description"
        onChange={(event) => setDescription(event.target.value)}
        placeholder="What is this meeting for?"
        required
        value={description}
      />

      {submissionError && <ErrorAlert message={submissionError} />}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            onClick={onCancel}
            type="button"
          >
            Cancel editing
          </button>
        )}
        <Button isLoading={isSubmitting} type="submit">
          {defaultValues ? 'Save Changes' : 'Create Booking'}
        </Button>
      </div>
    </form>
  )
}
