import { useSearch, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { HeaderRight } from '@/components/layout/header-right'
import { Search } from '@/components/search'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { PackingListsDialogs } from './components/packing-lists-dialogs'
import { PackingListPrimaryButtons } from './components/packing-list-primary-buttons'
import { PackingListsProvider, usePackingLists } from './components/packing-lists-provider'
import { PackingListsTable } from './components/packing-lists-table'
import { PackingListsReportView } from './components/packing-lists-report-view'
import { PackingListsKanbanView } from './components/packing-lists-kanban-view'
import { PackingListDetailView } from './components/packing-list-detail-view'
import { packingLists } from './data/packing-lists'

function PackingListsContent({
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
  const { viewMode, selectedPackingListId } = usePackingLists()

  return (
    <>
      <Header fixed>
        <Search />
        <HeaderRight />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6' fixed={viewMode === 'kanban'}>
        {!selectedPackingListId && (
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
              <p className='text-muted-foreground'>{description}</p>
            </div>
            <PackingListPrimaryButtons />
          </div>
        )}
        {selectedPackingListId ? (
          <PackingListDetailView data={packingLists} key={selectedPackingListId} />
        ) : viewMode === 'report' ? (
          <PackingListsReportView data={packingLists} search={search} navigate={navigate} />
        ) : viewMode === 'kanban' ? (
          <PackingListsKanbanView data={packingLists} search={search} />
        ) : (
          <PackingListsTable data={packingLists} search={search} navigate={navigate} />
        )}
      </Main>

      <PackingListsDialogs />
    </>
  )
}

export function PackingLists() {
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const navigate = useNavigate() as unknown as NavigateFn

  const title = 'Packing Lists'
  const description = 'Prepare packing manifests and track cargo packaging formats.'

  return (
    <PackingListsProvider>
      <PackingListsContent
        title={title}
        description={description}
        search={search}
        navigate={navigate}
      />
    </PackingListsProvider>
  )
}
