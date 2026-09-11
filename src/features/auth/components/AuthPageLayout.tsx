import type { ReactNode } from 'react'

interface AuthPageLayoutProps {
  children: ReactNode
  footer: ReactNode
  subtitle: string
  title: string
}

export function AuthPageLayout({
  children,
  footer,
  subtitle,
  title,
}: AuthPageLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
        {children}
        <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
      </section>
    </main>
  )
}
