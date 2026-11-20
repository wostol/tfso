import { cn } from '@/lib/utils'
import type { EventStatus, ResultStatus } from '@/lib/events-api'

/** Стиль и подпись для статуса мероприятия (из микросервиса) */
const eventStatusMeta: Record<EventStatus, { label: string; className: string }> = {
  upcoming: { label: 'Запланировано', className: 'bg-forest-soft text-forest-deep' },
  ongoing: { label: 'Идёт сейчас', className: 'bg-open/90 text-ink' },
  finished: { label: 'Завершено', className: 'bg-ink/10 text-muted-foreground' },
  cancelled: { label: 'Отменено', className: 'bg-destructive/15 text-destructive' },
}

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const meta = eventStatusMeta[status]
  return (
    <span className={cn('rounded-sm px-1.5 py-0.5 text-[11px] font-semibold', meta.className)}>
      {meta.label}
    </span>
  )
}

/** Стиль и подпись для статуса результата участника (как в протоколах SportOrg) */
const resultStatusMeta: Record<ResultStatus, { label: string; className: string }> = {
  OK: { label: 'OK', className: 'bg-forest-soft text-forest-deep' },
  DSQ: { label: 'DSQ', className: 'bg-destructive/15 text-destructive' },
  DNF: { label: 'DNF', className: 'bg-amber/20 text-amber' },
  DNS: { label: 'DNS', className: 'bg-ink/10 text-muted-foreground' },
  OTL: { label: 'OTL', className: 'bg-amber/20 text-amber' },
}

export function ResultStatusBadge({ status }: { status: ResultStatus }) {
  const meta = resultStatusMeta[status]
  return (
    <span className={cn('rounded-sm px-1.5 py-0.5 font-mono text-[11px] font-semibold', meta.className)}>
      {meta.label}
    </span>
  )
}
