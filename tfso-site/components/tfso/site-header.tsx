'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu, Search, UserRound, X } from 'lucide-react'
import { Logo } from './logo'
import { nav } from '@/lib/data'
import { cn } from '@/lib/utils'

function Overlay({
  dialogRef,
  title,
  children,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>
  title: string
  children: React.ReactNode
}) {
  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      className="m-auto w-[min(92vw,34rem)] rounded-xl border border-border bg-card p-0 text-foreground shadow-2xl"
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close()
      }}
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-5" />
          <span className="sr-only">Закрыть</span>
        </button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  )
}

const inputClass =
  'h-11 w-full rounded-md border border-input bg-background px-3 text-base outline-none transition focus-visible:border-course focus-visible:ring-3 focus-visible:ring-course/20'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef<HTMLDialogElement>(null)
  const signInRef = useRef<HTMLDialogElement>(null)
  const menuRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled
            ? 'border-b border-border/70 bg-paper/75 shadow-sm backdrop-blur-xl backdrop-saturate-150'
            : 'bg-transparent',
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-all duration-300 md:px-8',
            scrolled ? 'h-16' : 'h-20 md:h-24',
          )}
        >
          <Logo compact={scrolled} />

          <nav aria-label="Основная навигация" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="rounded-md px-3 py-2 text-[15px] font-medium text-ink/80 transition hover:bg-ink/5 hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => searchRef.current?.showModal()}
              className="flex size-10 items-center justify-center rounded-md text-ink/80 transition hover:bg-ink/5 hover:text-ink"
            >
              <Search className="size-5" />
              <span className="sr-only">Поиск по сайту</span>
            </button>
            <button
              type="button"
              onClick={() => signInRef.current?.showModal()}
              className="hidden h-10 items-center gap-2 rounded-md border border-ink/15 bg-card/60 px-4 text-sm font-semibold text-ink transition hover:border-ink/30 hover:bg-card sm:flex"
            >
              <UserRound className="size-4" />
              Войти
            </button>
            <button
              type="button"
              onClick={() => menuRef.current?.showModal()}
              className="flex size-10 items-center justify-center rounded-md text-ink transition hover:bg-ink/5 lg:hidden"
            >
              <Menu className="size-5" />
              <span className="sr-only">Открыть меню</span>
            </button>
          </div>
        </div>
      </header>

      <Overlay dialogRef={searchRef} title="Поиск">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          <label htmlFor="site-search" className="sr-only">
            Что ищем
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="site-search"
              type="search"
              autoFocus
              placeholder="Старт, протокол, район, клуб…"
              className={cn(inputClass, 'pl-10')}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['Кубок Томска', 'Басандайка', 'Положение 2026', 'Сплиты'].map((q) => (
              <button
                key={q}
                type="button"
                className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:border-course hover:text-course"
              >
                {q}
              </button>
            ))}
          </div>
        </form>
      </Overlay>

      <Overlay dialogRef={signInRef} title="Вход для участников">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signin-email" className="text-sm font-medium">
              Электронная почта
            </label>
            <input id="signin-email" type="email" autoComplete="email" autoFocus className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signin-password" className="text-sm font-medium">
              Пароль
            </label>
            <input id="signin-password" type="password" autoComplete="current-password" className={inputClass} />
          </div>
          <button
            type="submit"
            className="mt-2 h-11 rounded-md bg-course font-semibold text-white transition hover:bg-course/90"
          >
            Войти
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Нет аккаунта?{' '}
            <a href="#beginners" className="font-medium text-course underline-offset-4 hover:underline">
              Вступить в федерацию
            </a>
          </p>
        </form>
      </Overlay>

      <Overlay dialogRef={menuRef} title="Меню">
        <nav aria-label="Мобильная навигация">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => menuRef.current?.close()}
                  className="block border-b border-border py-3 font-heading text-xl font-semibold"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Overlay>
    </>
  )
}
