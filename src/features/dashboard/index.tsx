import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { HeaderRight } from '@/components/layout/header-right'
import { Search } from '@/components/search'

import { KpiCards } from './components/crm/kpi-cards'
import { PipelineActivity } from './components/crm/pipeline-activity'
import { TaskReminders } from './components/crm/task-reminders'
import { OpportunitiesSection } from './components/crm/opportunities-section'

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <HeaderRight />
      </Header>

      {/* ===== Main ===== */}
      <Main className="flex flex-col gap-4 md:gap-6">
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
            <p className='text-muted-foreground'>
              Monitor opportunities, qualified leads, and pipeline activities here.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>

        <KpiCards />
        <PipelineActivity />
        <TaskReminders />
        <OpportunitiesSection />
      </Main>
    </>
  )
}


