import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, id, label, name, ...props }, ref) => {
    const inputId = id ?? name

    return (
      <div className="w-full">
        {label && (
          <label
            className="mb-1.5 block text-sm font-medium text-slate-700"
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
          } ${className}`}
          id={inputId}
          name={name}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600" id={`${inputId}-error`}>
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
