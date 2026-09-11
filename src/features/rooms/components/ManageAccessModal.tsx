import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import type { Room, RoomRole } from '../../../types'

interface ManageAccessModalProps {
  isOpen: boolean
  onClose: () => void
  room: Room | null
  onUpdateAccess: (
    roomId: string,
    newAllowedUsers: RoomRole[],
  ) => void | Promise<void>
}

export function ManageAccessModal({
  isOpen,
  onClose,
  onUpdateAccess,
  room,
}: ManageAccessModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<RoomRole['role']>('User')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const roomId = room?.id

  useEffect(() => {
    setEmail('')
    setRole('User')
    setError('')
  }, [isOpen, roomId])

  if (!room) {
    return null
  }

  const handleAddUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      return
    }

    const existingUser = room.allowedUsers.some(
      (allowedUser) => allowedUser.email.toLowerCase() === normalizedEmail,
    )
    const updatedUsers = existingUser
      ? room.allowedUsers.map((allowedUser) =>
          allowedUser.email.toLowerCase() === normalizedEmail
            ? { ...allowedUser, role }
            : allowedUser,
        )
      : [...room.allowedUsers, { email: normalizedEmail, role }]

    setIsSaving(true)
    setError('')

    try {
      await onUpdateAccess(room.id, updatedUsers)
      setEmail('')
      setRole('User')
    } catch {
      setError('Unable to update room access.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveUser = async (emailToRemove: string) => {
    const updatedUsers = room.allowedUsers.filter(
      (allowedUser) => allowedUser.email !== emailToRemove,
    )

    setIsSaving(true)
    setError('')

    try {
      await onUpdateAccess(room.id, updatedUsers)
    } catch {
      setError('Unable to remove user access.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Access">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            People with access
          </h3>
          {room.allowedUsers.length === 0 ? (
            <p className="mt-3 rounded-lg bg-gray-50 px-4 py-5 text-center text-sm text-gray-500">
              No additional users have access to this room.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100 rounded-lg border border-gray-200">
              {room.allowedUsers.map((allowedUser) => (
                <li
                  className="flex items-center justify-between gap-3 px-4 py-3"
                  key={allowedUser.email}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {allowedUser.email}
                    </p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        allowedUser.role === 'Admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {allowedUser.role}
                    </span>
                  </div>
                  <button
                    className="shrink-0 text-sm font-medium text-red-600 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSaving}
                    onClick={() => void handleRemoveUser(allowedUser.email)}
                    type="button"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          className="space-y-4 border-t border-gray-200 pt-6"
          onSubmit={handleAddUser}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Add a user
          </h3>
          <Input
            autoComplete="email"
            label="Email address"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="colleague@example.com"
            required
            type="email"
            value={email}
          />
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-gray-700"
              htmlFor="access-role"
            >
              Role
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              id="access-role"
              onChange={(event) =>
                setRole(event.target.value as RoomRole['role'])
              }
              value={role}
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          {error && (
            <div
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Button isLoading={isSaving} type="submit">
              Add
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
