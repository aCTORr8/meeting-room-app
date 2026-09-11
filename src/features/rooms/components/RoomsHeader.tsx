import { Button } from '../../../components/ui/Button'

interface RoomsHeaderProps {
  onCreate: () => void
}

export function RoomsHeader({ onCreate }: RoomsHeaderProps) {
  return (
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
      <Button className="shrink-0" onClick={onCreate} type="button">
        Create Room
      </Button>
    </div>
  )
}
