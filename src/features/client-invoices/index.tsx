import { useSearch, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { HeaderRight } from '@/components/layout/header-right'
import { Search } from '@/components/search'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { InvoicesDialogs } from './components/invoices-dialogs'
import { InvoicePrimaryButtons } from './components/invoice-primary-buttons'
import { InvoicesProvider, useInvoices } from './components/invoices-provider'
import { InvoicesTable } from './components/invoices-table'
import { InvoicesReportView } from './components/invoices-report-view'
import { InvoicesKanbanView } from './components/invoices-kanban-view'
import { InvoiceDetailView } from './components/invoice-detail-view'
import { invoices } from './data/invoices'

function InvoicesContent({
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
  const { viewMode, selectedInvoiceId } = useInvoices()

  return (
    <>
      <Header fixed>
        <Search />
        <HeaderRight />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6' fixed={viewMode === 'kanban'}>
        {!selectedInvoiceId && (
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
              <p className='text-muted-foreground'>{description}</p>
            </div>
            <InvoicePrimaryButtons />
          </div>
        )}
        {selectedInvoiceId ? (
          <InvoiceDetailView data={invoices} key={selectedInvoiceId} />
        ) : viewMode === 'report' ? (
          <InvoicesReportView data={invoices} search={search} />
        ) : viewMode === 'kanban' ? (
          <InvoicesKanbanView data={invoices} search={search} />
        ) : (
          <InvoicesTable data={invoices} search={search} navigate={navigate} />
        )}
      </Main>

      <InvoicesDialogs />
    </>
  )
}

export function ClientInvoices() {
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const navigate = useNavigate() as unknown as NavigateFn

  const title = 'Client Invoices'
  const description = 'Manage and audit commercial invoices, tax billing entries, proformas, and client payments.'

  return (
    <InvoicesProvider>
      <InvoicesContent
        title={title}
        description={description}
        search={search}
        navigate={navigate}
      />
    </InvoicesProvider>
  )
}
