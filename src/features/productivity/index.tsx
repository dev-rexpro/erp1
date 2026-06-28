import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { HeaderRight } from '@/components/layout/header-right'
import { Search } from '@/components/search'

import { CalendarPanel } from './components/calendar-panel'
import { FocusCard } from './components/focus-card'
import { ProjectsSection } from './components/projects-section'
import { QuickActions } from './components/quick-actions'
import { QuoteCard } from './components/quote-card'
import { RecentNotesCard } from './components/recent-notes-card'
import { SummaryCards } from './components/summary-cards'
import { TasksSection } from './components/tasks-section'
import { WeeklySummaryCard } from './components/weekly-summary-card'

export function Productivity() {
  return (
    <>
      {/* ===== Header ===== */}
      <Header fixed>
        <Search />
        <HeaderRight />
      </Header>

      {/* ===== Main Content ===== */}
      <Main className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl text-foreground font-semibold leading-none tracking-tight'>Good morning, Fadhlur.</h1>
          <p className='text-lg text-muted-foreground leading-none'>
            Let&apos;s make today productive and meaningful.
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-12'>
          <section className='lg:col-span-9 flex flex-col gap-6'>
            <SummaryCards />
            <TasksSection />
            <ProjectsSection />
            <QuickActions />
            <QuoteCard />
          </section>

          <section className='flex flex-col gap-6 lg:col-span-3'>
            <CalendarPanel />
            <FocusCard />
            <RecentNotesCard />
            <WeeklySummaryCard />
          </section>
        </div>
      </Main>
    </>
  )
}
