import { LoadingSpinner } from './LoadingSpinner'

interface FullPageLoaderProps {
  label?: string
}

export function FullPageLoader({ label }: FullPageLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <LoadingSpinner label={label} size="large" />
    </div>
  )
}
