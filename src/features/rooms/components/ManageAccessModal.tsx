import { useEffect, useState } from 'react'
import { ErrorAlert } from '../../../components/ui/ErrorAlert'
import { Modal } from '../../../components/ui/Modal'
import type { Room, RoomRole } from '../../../types'
import { AccessForm } from './AccessForm'
import { AccessList } from './AccessList'

interface ManageAccessModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateAccess: (
    roomId: string,
    allowedUsers: RoomRole[],
  ) => void | Promise<void>
  room: Room | null
}

export function ManageAccessModal({
  isOpen,
  onClose,
  onUpdateAccess,
  room,
}: ManageAccessModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const roomId = room?.id

  useEffect(() => {
    setUpdateError('')
  }, [isOpen, roomId])

  if (!room) {
    return null
  }

  const updateAccess = async (allowedUsers: RoomRole[], errorMessage: string) => {
    setIsUpdating(true)
    setUpdateError('')

    try {
      await onUpdateAccess(room.id, allowedUsers)
    } catch {
      setUpdateError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddUser = async (email: string, role: RoomRole['role']) => {
    const alreadyAllowed = room.allowedUsers.some(
      (allowedUser) => allowedUser.email.toLowerCase() === email,
    )
    const updatedAllowedUsers = alreadyAllowed
      ? room.allowedUsers.map((allowedUser) =>
          allowedUser.email.toLowerCase() === email
            ? { ...allowedUser, role }
            : allowedUser,
        )
      : [...room.allowedUsers, { email, role }]

    await updateAccess(updatedAllowedUsers, 'Unable to update room access.')
  }

  const handleRemoveUser = async (email: string) => {
    const updatedAllowedUsers = room.allowedUsers.filter(
      (allowedUser) => allowedUser.email !== email,
    )

    try {
      await updateAccess(updatedAllowedUsers, 'Unable to remove user access.')
    } catch {
      return
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Access">
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          People with access
        </h3>
        <AccessList
          allowedUsers={room.allowedUsers}
          isUpdating={isUpdating}
          onRemove={handleRemoveUser}
        />
      </section>

      <div className="mt-6 border-t border-slate-100 pt-6">
        {updateError && <ErrorAlert className="mb-4" message={updateError} />}
        <AccessForm isUpdating={isUpdating} onSubmit={handleAddUser} />
      </div>
    </Modal>
  )
}
