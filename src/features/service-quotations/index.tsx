import { useSearch, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { HeaderRight } from '@/components/layout/header-right'
import { Search } from '@/components/search'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { QuotationsDialogs } from './components/quotations-dialogs'
import { QuotationPrimaryButtons } from './components/quotation-primary-buttons'
import { QuotationsProvider, useQuotations } from './components/quotations-provider'
import { QuotationsTable } from './components/quotations-table'
import { QuotationsReportView } from './components/quotations-report-view'
import { QuotationsKanbanView } from './components/quotations-kanban-view'
import { QuotationDetailView } from './components/quotation-detail-view'
import { quotations } from './data/quotations'

function QuotationsContent({
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
  const { viewMode, selectedQuotationId } = useQuotations()

  return (
    <>
      <Header fixed>
        <Search />
        <HeaderRight />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6' fixed={viewMode === 'kanban'}>
        {!selectedQuotationId && (
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
              <p className='text-muted-foreground'>{description}</p>
            </div>
            <QuotationPrimaryButtons />
          </div>
        )}
        {selectedQuotationId ? (
          <QuotationDetailView data={quotations} key={selectedQuotationId} />
        ) : viewMode === 'report' ? (
          <QuotationsReportView data={quotations} search={search} navigate={navigate} />
        ) : viewMode === 'kanban' ? (
          <QuotationsKanbanView data={quotations} search={search} />
        ) : (
          <QuotationsTable data={quotations} search={search} navigate={navigate} />
        )}
      </Main>

      <QuotationsDialogs />
    </>
  )
}

export function ServiceQuotations() {
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const navigate = useNavigate() as unknown as NavigateFn

  const title = 'Service Quotations'
  const description = 'Manage service rates, active pricing proposals, and client cost estimations here.'

  return (
    <QuotationsProvider>
      <QuotationsContent
        title={title}
        description={description}
        search={search}
        navigate={navigate}
      />
    </QuotationsProvider>
  )
}
