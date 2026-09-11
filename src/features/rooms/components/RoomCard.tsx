import type { Room } from '../../../types'

interface RoomCardProps {
  room: Room
  onEdit: (room: Room) => void
  onDelete: (roomId: string) => void | Promise<void>
  onManageAccess: (room: Room) => void
  currentUserId?: string
}

export function RoomCard({
  currentUserId,
  onDelete,
  onEdit,
  onManageAccess,
  room,
}: RoomCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
      <p className="text-gray-600 flex-grow">{room.description}</p>

      {room.ownerId === currentUserId && (
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => onManageAccess(room)}
            type="button"
          >
            Manage Access
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            onClick={() => onEdit(room)}
            type="button"
          >
            Edit
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            onClick={() => void onDelete(room.id)}
            type="button"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
