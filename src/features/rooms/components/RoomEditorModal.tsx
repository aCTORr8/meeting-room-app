import { useMemo } from 'react'
import { ErrorAlert } from '../../../components/ui/ErrorAlert'
import { Modal } from '../../../components/ui/Modal'
import type { Room } from '../../../types'
import type { RoomFormValues } from '../roomTypes'
import { RoomForm } from './RoomForm'

interface RoomEditorModalProps {
  error: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: RoomFormValues) => void | Promise<void>
  room: Room | null
}

export function RoomEditorModal({
  error,
  isOpen,
  onClose,
  onSubmit,
  room,
}: RoomEditorModalProps) {
  const defaultValues = useMemo(
    () =>
      room ? { description: room.description, name: room.name } : undefined,
    [room],
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={room ? 'Edit Room' : 'Create Room'}
    >
      {error && <ErrorAlert className="mb-5" message={error} />}
      <RoomForm
        defaultValues={defaultValues}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}
