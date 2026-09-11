interface LoadingSpinnerProps {
  label?: string
  size?: 'small' | 'medium' | 'large'
}

const sizeClasses = {
  small: 'h-5 w-5 border-2',
  medium: 'h-8 w-8 border-4',
  large: 'h-11 w-11 border-4',
}

export function LoadingSpinner({
  label = 'Loading',
  size = 'medium',
}: LoadingSpinnerProps) {
  return (
    <div
      aria-label={label}
      className={`${sizeClasses[size]} animate-spin rounded-full border-indigo-200 border-t-indigo-600`}
      role="status"
    />
  )
}
