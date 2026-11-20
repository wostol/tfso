import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
          Мероприятие не найдено
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Возможно, ссылка устарела или мероприятие было удалено из микросервиса.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/events"
            className="inline-flex h-10 items-center rounded-md bg-course px-5 font-semibold text-white transition hover:bg-course/90"
          >
            В календарь
          </Link>
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
