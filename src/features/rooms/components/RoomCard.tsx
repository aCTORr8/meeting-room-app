import type { Room } from '../../../types'

interface RoomCardProps {
  room: Room
  onEdit: (room: Room) => void
  onDelete: (roomId: string) => void | Promise<void>
  onManageAccess: (room: Room) => void
  onBook: (room: Room) => void
  currentUserId?: string
}

export function RoomCard({
  currentUserId,
  onBook,
  onDelete,
  onEdit,
  onManageAccess,
  room,
}: RoomCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full border border-gray-200">
      <h3 className="text-lg font-semibold text-slate-900 truncate">
        {room.name}
      </h3>
      <p className="text-slate-500 mt-2 text-sm flex-grow line-clamp-3 break-words">
        {room.description}
      </p>

      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
          onClick={() => onBook(room)}
          type="button"
        >
          Book
        </button>
        {room.ownerId === currentUserId && (
          <>
            <button
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all"
              onClick={() => onManageAccess(room)}
              type="button"
            >
              Manage Access
            </button>
            <button
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all"
              onClick={() => onEdit(room)}
              type="button"
            >
              Edit
            </button>
            <button
              className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
              onClick={() => void onDelete(room.id)}
              type="button"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}
