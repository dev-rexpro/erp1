import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { HeaderRight } from '@/components/layout/header-right'
import { Search } from '@/components/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AnalyticsKpiStrip } from './components/analytics-kpi-strip'
import { AnalyticsToolbar } from './components/analytics-toolbar'
import { RealtimeVisitors } from './components/realtime-visitors'
import { TopPages } from './components/top-pages'
import { TopTrafficSources } from './components/top-traffic-sources'
import { TrafficQuality } from './components/traffic-quality'

// Import stylesheet for country flags
import '@/styles/flag-icons/flags.css'

export function Analytics() {
  return (
    <>
      {/* ===== Header ===== */}
      <Header fixed>
        <Search />
        <HeaderRight />
      </Header>

      {/* ===== Main ===== */}
      <Main className='flex flex-col gap-4 sm:gap-6'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl text-foreground font-semibold leading-none tracking-tight'>Hello, Fadhlur</h1>
          <p className='text-muted-foreground text-sm'>
            Monitor shipment traffic, vessel transit times, customs clearance, and carrier volumes in one view.
          </p>
        </div>

        <Tabs defaultValue='overview' className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <TabsList className='gap-1'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='vessels'>Vessels & Transit</TabsTrigger>
              <TabsTrigger value='customs'>Customs & Compliance</TabsTrigger>
              <TabsTrigger value='finance'>Freight Revenue</TabsTrigger>
            </TabsList>

            <AnalyticsToolbar />
          </div>

          <TabsContent value='overview' className='flex flex-col gap-4'>
            <AnalyticsKpiStrip />

            <div className='grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12'>
              <div className='xl:col-span-7'>
                <TrafficQuality />
              </div>
              <div className='xl:col-span-5'>
                <RealtimeVisitors />
              </div>
            </div>

            <div className='grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12'>
              <div className='xl:col-span-7'>
                <TopPages />
              </div>
              <div className='xl:col-span-5 xl:col-start-8'>
                <TopTrafficSources />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='vessels'>
            <div className='flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground text-xs font-medium'>
              Vessel tracking and detailed transit analysis coming soon.
            </div>
          </TabsContent>

          <TabsContent value='customs'>
            <div className='flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground text-xs font-medium'>
              Customs clearances and tariff audit logs coming soon.
            </div>
          </TabsContent>

          <TabsContent value='finance'>
            <div className='flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground text-xs font-medium'>
              Revenue metrics and outstanding receivables coming soon.
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
