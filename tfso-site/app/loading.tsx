/**
 * Глобальный loading.tsx — показывается пока серверные компоненты
 * ждут данных от микросервиса.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <span className="relative flex size-12">
          <span className="absolute inset-0 animate-ping rounded-full bg-course/30" />
          <span className="relative flex size-12 items-center justify-center rounded-full bg-course text-white font-mono text-xs font-bold">
            ТФСО
          </span>
        </span>
        <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          Загружаем календарь…
        </p>
      </div>
    </div>
  )
}
