import { ResultStatusBadge } from '@/components/tfso/event-status-badge'
import type { ApiResult } from '@/lib/events-api'

/**
 * Таблица протокола результатов. Данные приходят с микросервиса уже
 * с распределением мест: place = 1 — победитель, place = null — сошедшие.
 */
export function ResultsTable({ results }: { results: ApiResult[] }) {
  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Результатов пока нет. После завершения соревнований протокол
        автоматически появится здесь.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/30 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-3 py-3 text-left sm:px-4">Место</th>
            <th className="px-3 py-3 text-left sm:px-4">Участник</th>
            <th className="px-3 py-3 text-left sm:px-4">Команда</th>
            <th className="px-3 py-3 text-left sm:px-4">Г.р.</th>
            <th className="px-3 py-3 text-left sm:px-4">Время</th>
            <th className="px-3 py-3 text-left sm:px-4">Статус</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {results.map((r) => (
            <tr key={r.id} className="transition hover:bg-muted/30">
              <td className="px-3 py-3 sm:px-4">
                <span
                  className={
                    r.place === 1
                      ? 'font-mono text-base font-bold text-course'
                      : r.place != null
                        ? 'font-mono text-base font-semibold text-ink'
                        : 'font-mono text-muted-foreground'
                  }
                >
                  {r.place ?? '—'}
                </span>
              </td>
              <td className="px-3 py-3 font-semibold text-ink sm:px-4">{r.athleteName}</td>
              <td className="px-3 py-3 text-muted-foreground sm:px-4">{r.team ?? '—'}</td>
              <td className="px-3 py-3 font-mono tabular-nums text-muted-foreground sm:px-4">
                {r.birthYear ?? '—'}
              </td>
              <td className="px-3 py-3 font-mono tabular-nums text-ink sm:px-4">
                {r.timeFormatted ?? '—'}
              </td>
              <td className="px-3 py-3 sm:px-4">
                <ResultStatusBadge status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
