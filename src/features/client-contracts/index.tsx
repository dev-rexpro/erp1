import { useSearch, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { HeaderRight } from '@/components/layout/header-right'
import { Search } from '@/components/search'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { ContractsDialogs } from './components/contracts-dialogs'
import { ContractPrimaryButtons } from './components/contract-primary-buttons'
import { ContractsProvider, useContracts } from './components/contracts-provider'
import { ContractsTable } from './components/contracts-table'
import { ContractsReportView } from './components/contracts-report-view'
import { ContractsKanbanView } from './components/contracts-kanban-view'
import { ContractDetailView } from './components/contract-detail-view'
import { contracts } from './data/contracts'

function ContractsContent({
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
  const { viewMode, selectedContractId } = useContracts()

  return (
    <>
      <Header fixed>
        <Search />
        <HeaderRight />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6' fixed={viewMode === 'kanban'}>
        {!selectedContractId && (
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
              <p className='text-muted-foreground'>{description}</p>
            </div>
            <ContractPrimaryButtons />
          </div>
        )}
        {selectedContractId ? (
          <ContractDetailView data={contracts} key={selectedContractId} />
        ) : viewMode === 'report' ? (
          <ContractsReportView data={contracts} search={search} navigate={navigate} />
        ) : viewMode === 'kanban' ? (
          <ContractsKanbanView data={contracts} search={search} />
        ) : (
          <ContractsTable data={contracts} search={search} navigate={navigate} />
        )}
      </Main>

      <ContractsDialogs />
    </>
  )
}

export function ClientContracts() {
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const navigate = useNavigate() as unknown as NavigateFn

  const title = 'Client Contracts'
  const description = 'Monitor binding corporate agreements, SLAs, service scope tiers, and status conditions.'

  return (
    <ContractsProvider>
      <ContractsContent
        title={title}
        description={description}
        search={search}
        navigate={navigate}
      />
    </ContractsProvider>
  )
}
