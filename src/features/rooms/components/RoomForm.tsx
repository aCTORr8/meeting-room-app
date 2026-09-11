import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

export interface RoomFormData {
  name: string
  description: string
}

interface RoomFormProps {
  defaultValues?: RoomFormData
  onSubmit: (data: RoomFormData) => void | Promise<void>
  onCancel: () => void
}

const emptyValues: RoomFormData = {
  name: '',
  description: '',
}

export function RoomForm({
  defaultValues = emptyValues,
  onCancel,
  onSubmit,
}: RoomFormProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<RoomFormData>({ defaultValues })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const submitForm: SubmitHandler<RoomFormData> = async (data) => {
    await onSubmit({
      description: data.description.trim(),
      name: data.name.trim(),
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
      <Input
        autoFocus
        error={errors.name?.message}
        label="Room name"
        placeholder="Conference Room A"
        {...register('name', {
          required: 'Room name is required',
          validate: (value) =>
            value.trim().length > 0 || 'Room name is required',
        })}
      />
      <Input
        error={errors.description?.message}
        label="Description"
        placeholder="Describe the room and its amenities"
        {...register('description', {
          required: 'Description is required',
          validate: (value) =>
            value.trim().length > 0 || 'Description is required',
        })}
      />

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <Button isLoading={isSubmitting} type="submit">
          Save Room
        </Button>
      </div>
    </form>
  )
}
