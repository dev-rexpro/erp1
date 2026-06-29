import { useSearch, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { HeaderRight } from '@/components/layout/header-right'
import { Search } from '@/components/search'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { ShipmentsDialogs } from './components/shipments-dialogs'
import { ShipmentPrimaryButtons } from './components/shipment-primary-buttons'
import { ShipmentsProvider, useShipments } from './components/shipments-provider'
import { ShipmentsTable } from './components/shipments-table'
import { ShipmentsKanbanView } from './components/shipments-kanban-view'
import { ShipmentDetailView } from './components/shipment-detail-view'
import { shipments } from './data/shipments'

function ShipmentsContent({
  title,
  description,
  search,
  navigate,
}: {
  title: string
  description: string
  search: Record<string, unknown>
  navigate: NavigateFn
}) {
  const { viewMode, selectedShipmentId } = useShipments()

  return (
    <>
      <Header fixed>
        <Search />
        <HeaderRight />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6' fixed={viewMode === 'kanban'}>
        {!selectedShipmentId && (
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
              <p className='text-muted-foreground'>{description}</p>
            </div>
            <ShipmentPrimaryButtons />
          </div>
        )}
        {selectedShipmentId ? (
          <ShipmentDetailView data={shipments} key={selectedShipmentId} />
        ) : viewMode === 'kanban' ? (
          <ShipmentsKanbanView data={shipments} search={search} />
        ) : (
          <ShipmentsTable data={shipments} search={search} navigate={navigate} />
        )}
      </Main>

      <ShipmentsDialogs />
    </>
  )
}

export function Shipments() {
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const navigate = useNavigate() as unknown as NavigateFn

  const title = 'Shipment Registry'
  const description = 'Monitor carrier schedules, transit milestones, and dispatch controls.'

  return (
    <ShipmentsProvider>
      <ShipmentsContent
        title={title}
        description={description}
        search={search}
        navigate={navigate}
      />
    </ShipmentsProvider>
  )
}
