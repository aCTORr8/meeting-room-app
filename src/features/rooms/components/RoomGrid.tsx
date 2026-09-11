import { Button } from '../../../components/ui/Button'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'
import type { Room } from '../../../types'
import { RoomCard } from './RoomCard'

interface RoomGridProps {
  currentUserId?: string
  isLoading: boolean
  onBook: (room: Room) => void
  onCreate: () => void
  onDelete: (roomId: string) => void | Promise<void>
  onEdit: (room: Room) => void
  onManageAccess: (room: Room) => void
  rooms: Room[]
}

export function RoomGrid({
  currentUserId,
  isLoading,
  onBook,
  onCreate,
  onDelete,
  onEdit,
  onManageAccess,
  rooms,
}: RoomGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner label="Loading rooms" size="large" />
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
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
        <Button className="mt-6" onClick={onCreate} type="button">
          Create Room
        </Button>
      </section>
    )
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard
          currentUserId={currentUserId}
          key={room.id}
          onBook={onBook}
          onDelete={onDelete}
          onEdit={onEdit}
          onManageAccess={onManageAccess}
          room={room}
        />
      ))}
    </div>
  )
}
