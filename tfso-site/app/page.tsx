import { SiteHeader } from '@/components/tfso/site-header'
import { Hero } from '@/components/tfso/hero'
import { QuickLinks } from '@/components/tfso/quick-links'
import { News } from '@/components/tfso/news'
import { Calendar } from '@/components/tfso/calendar'
import { Results } from '@/components/tfso/results'
import { Beginners } from '@/components/tfso/beginners'
import { SiteFooter } from '@/components/tfso/site-footer'

export default async function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Перейти к содержанию
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <QuickLinks />
        <News />
        <Calendar />
        <Results />
        <Beginners />
      </main>
      <SiteFooter />
    </>
  )
}
