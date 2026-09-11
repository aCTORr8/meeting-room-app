import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../context/AuthContext'
import { RoomCard } from '../features/rooms/components/RoomCard'
import {
  RoomForm,
  type RoomFormData,
} from '../features/rooms/components/RoomForm'
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
} from '../features/rooms/roomService'
import type { Room } from '../types'

export function Dashboard() {
  const { logout, user } = useAuth()
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [error, setError] = useState('')

  const loadRooms = useCallback(async () => {
    setError('')

    try {
      setRooms(await getRooms())
    } catch {
      setError('Unable to load meeting rooms.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRooms()
  }, [loadRooms])

  const formDefaultValues = useMemo<RoomFormData | undefined>(
    () =>
      editingRoom
        ? {
            description: editingRoom.description,
            name: editingRoom.name,
          }
        : undefined,
    [editingRoom],
  )

  const openCreateModal = () => {
    setEditingRoom(null)
    setError('')
    setIsModalOpen(true)
  }

  const openEditModal = (room: Room) => {
    setEditingRoom(room)
    setError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRoom(null)
    setError('')
  }

  const handleSubmit = async (data: RoomFormData) => {
    if (!user) {
      return
    }

    setError('')

    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, data)
      } else {
        await createRoom({
          ...data,
          allowedUsers: [],
          ownerId: user.uid,
        })
      }

      setIsModalOpen(false)
      setEditingRoom(null)
      await loadRooms()
    } catch {
      setError(
        editingRoom
          ? 'Unable to update the meeting room.'
          : 'Unable to create the meeting room.',
      )
    }
  }

  const handleDelete = async (roomId: string) => {
    setError('')

    try {
      await deleteRoom(roomId)
      await loadRooms()
    } catch {
      setError('Unable to delete the meeting room.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Meeting Rooms</h1>
            <p className="mt-1 hidden text-sm text-slate-500 sm:block">
              Signed in as {user?.displayName ?? user?.email}
            </p>
          </div>
          <Button onClick={() => void logout()} type="button">
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Workspace
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Available rooms
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Find the right space for your next meeting or create a new room.
            </p>
          </div>
          <Button className="shrink-0" onClick={openCreateModal} type="button">
            Create Room
          </Button>
        </div>

        {error && !isModalOpen && (
          <div
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div
              aria-label="Loading rooms"
              className="h-11 w-11 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
              role="status"
            />
          </div>
        ) : rooms.length === 0 ? (
          <section className="rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-bold text-indigo-700">
              +
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No meeting rooms yet
            </h3>
            <p className="mt-2 text-slate-500">
              Create the first room for your workspace.
            </p>
            <Button className="mt-6" onClick={openCreateModal} type="button">
              Create Room
            </Button>
          </section>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {rooms.map((room) => (
              <RoomCard
                currentUserId={user?.uid}
                key={room.id}
                onDelete={handleDelete}
                onEdit={openEditModal}
                room={room}
              />
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRoom ? 'Edit Room' : 'Create Room'}
      >
        {error && (
          <div
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}
        <RoomForm
          defaultValues={formDefaultValues}
          onCancel={closeModal}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  )
}
