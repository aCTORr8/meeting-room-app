import type { RoomRole } from '../../../types'

interface AccessListProps {
  allowedUsers: RoomRole[]
  isUpdating: boolean
  onRemove: (email: string) => void | Promise<void>
}

export function AccessList({
  allowedUsers,
  isUpdating,
  onRemove,
}: AccessListProps) {
  if (allowedUsers.length === 0) {
    return (
      <p className="mt-3 rounded-lg bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
        No additional users have access to this room.
      </p>
    )
  }

  return (
    <ul className="mt-3">
      {allowedUsers.map((allowedUser) => (
        <li
          className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3"
          key={allowedUser.email}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="truncate text-sm font-medium text-slate-700">
              {allowedUser.email}
            </span>
            <span className="inline-flex shrink-0 items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {allowedUser.role}
            </span>
          </div>
          <button
            className="shrink-0 text-sm font-medium text-red-500 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isUpdating}
            onClick={() => void onRemove(allowedUser.email)}
            type="button"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}
