'use client'

import Link from 'next/link'

/**
 * Глобальный error.tsx — cathes любые неперехваченные ошибки в Server Components,
 * включая падение микросервиса во время рендера страницы.
 *
 * Важно: это CLIENT component (требование Next.js для error boundary).
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-destructive">Ошибка</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
          Не удалось загрузить страницу
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Скорее всего, микросервис <code className="font-mono">tfso-events-api</code> недоступен.
          Проверьте, что контейнеры запущены, и попробуйте ещё раз.
        </p>
        {error?.message && (
          <p className="mt-3 rounded-md bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
            {error.message}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center rounded-md bg-course px-5 font-semibold text-white transition hover:bg-course/90"
          >
            Повторить
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-md border border-ink/15 px-5 font-semibold text-ink transition hover:bg-ink hover:text-paper"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
}
