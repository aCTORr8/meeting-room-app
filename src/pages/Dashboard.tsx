import { useState } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import { ErrorAlert } from '../components/ui/ErrorAlert'
import { useAuth } from '../features/auth/useAuth'
import { BookingModal } from '../features/bookings/components/BookingModal'
import { ManageAccessModal } from '../features/rooms/components/ManageAccessModal'
import { RoomEditorModal } from '../features/rooms/components/RoomEditorModal'
import { RoomGrid } from '../features/rooms/components/RoomGrid'
import { RoomsHeader } from '../features/rooms/components/RoomsHeader'
import type { RoomFormValues } from '../features/rooms/roomTypes'
import { useRooms } from '../features/rooms/useRooms'
import type { Room, RoomRole } from '../types'

export function Dashboard() {
  const { logout, user } = useAuth()
  const {
    clearError,
    error,
    isLoading,
    removeRoom,
    rooms,
    saveRoom,
    updateRoomAccess,
  } = useRooms(user?.uid)
  const [isRoomEditorOpen, setIsRoomEditorOpen] = useState(false)
  const [roomBeingEdited, setRoomBeingEdited] = useState<Room | null>(null)
  const [roomWithManagedAccess, setRoomWithManagedAccess] =
    useState<Room | null>(null)
  const [roomBeingBooked, setRoomBeingBooked] = useState<Room | null>(null)

  const openCreateRoomModal = () => {
    setRoomBeingEdited(null)
    clearError()
    setIsRoomEditorOpen(true)
  }

  const openEditRoomModal = (room: Room) => {
    setRoomBeingEdited(room)
    clearError()
    setIsRoomEditorOpen(true)
  }

  const closeRoomEditor = () => {
    setIsRoomEditorOpen(false)
    setRoomBeingEdited(null)
    clearError()
  }

  const handleSaveRoom = async (values: RoomFormValues) => {
    const wasSaved = await saveRoom(values, roomBeingEdited)

    if (wasSaved) {
      setIsRoomEditorOpen(false)
      setRoomBeingEdited(null)
    }
  }

  const handleUpdateAccess = async (
    roomId: string,
    allowedUsers: RoomRole[],
  ) => {
    await updateRoomAccess(roomId, allowedUsers)
    setRoomWithManagedAccess((currentRoom) =>
      currentRoom?.id === roomId
        ? { ...currentRoom, allowedUsers }
        : currentRoom,
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AppHeader
        onLogout={logout}
        userLabel={user?.displayName ?? user?.email ?? 'User'}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <RoomsHeader onCreate={openCreateRoomModal} />
        {error && !isRoomEditorOpen && (
          <ErrorAlert className="mb-6" message={error} />
        )}
        <RoomGrid
          currentUserId={user?.uid}
          isLoading={isLoading}
          onBook={setRoomBeingBooked}
          onCreate={openCreateRoomModal}
          onDelete={removeRoom}
          onEdit={openEditRoomModal}
          onManageAccess={setRoomWithManagedAccess}
          rooms={rooms}
        />
      </main>

      <RoomEditorModal
        error={error}
        isOpen={isRoomEditorOpen}
        onClose={closeRoomEditor}
        onSubmit={handleSaveRoom}
        room={roomBeingEdited}
      />

      <ManageAccessModal
        isOpen={roomWithManagedAccess !== null}
        onClose={() => setRoomWithManagedAccess(null)}
        onUpdateAccess={handleUpdateAccess}
        room={roomWithManagedAccess}
      />

      <BookingModal
        currentUserId={user?.uid}
        isOpen={roomBeingBooked !== null}
        onClose={() => setRoomBeingBooked(null)}
        room={roomBeingBooked}
      />
    </div>
  )
}
