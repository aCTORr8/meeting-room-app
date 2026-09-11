import { forwardRef, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', disabled, isLoading = false, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400 ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
