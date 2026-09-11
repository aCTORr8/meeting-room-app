import { Button } from '../ui/Button'

interface AppHeaderProps {
  userLabel: string
  onLogout: () => void | Promise<void>
}

export function AppHeader({ onLogout, userLabel }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Meeting Rooms</h1>
          <p className="mt-1 hidden truncate text-sm text-slate-500 sm:block">
            Signed in as {userLabel}
          </p>
        </div>
        <Button className="shrink-0" onClick={() => void onLogout()} type="button">
          Logout
        </Button>
      </div>
    </header>
  )
}
