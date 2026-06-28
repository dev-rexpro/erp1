import { DataKanban, type KanbanColumnDef } from '@/components/data-table/data-kanban'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { type Quotation, type QuotationStatus } from '../data/schema'
import { useQuotations } from './quotations-provider'
import { quotations as staticQuotations } from '../data/quotations'
import { toast } from 'sonner'
import { getInitials } from '@/lib/utils'

interface QuotationsKanbanViewProps {
  data: Quotation[]
  search: Record<string, unknown>
}

const columns: KanbanColumnDef[] = [
  { id: 'invited', title: 'Draft', color: 'bg-sky-500' },
  { id: 'active', title: 'Accepted', color: 'bg-green-500' },
  { id: 'suspended', title: 'Rejected', color: 'bg-destructive' },
  { id: 'inactive', title: 'Expired', color: 'bg-amber-500' },
]

export function QuotationsKanbanView({ data, search }: QuotationsKanbanViewProps) {
  const { setViewMode, setSelectedQuotationId } = useQuotations()
  const searchQuery = (search.username as string) || ''

  const handleMoveCard = (id: string, newStatus: QuotationStatus) => {
    const item = staticQuotations.find((q) => q.id === id)
    if (item) {
      item.status = newStatus
      setViewMode((prev) => prev)
      toast.success(`Moved ${item.username} to ${newStatus}`)
    }
  }

  const renderCard = (quotation: Quotation) => {
    return (
      <div
        onClick={() => setSelectedQuotationId(quotation.id)}
        className='flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-xs cursor-pointer select-none'
      >
        <div className='min-w-0 space-y-1.5'>
          <div className='flex items-center justify-between gap-3'>
            <h3 className='min-w-0 truncate font-medium text-sm leading-none'>{quotation.firstName}</h3>
            <Badge className='shrink-0 rounded-md border-transparent px-2 font-medium' variant='outline'>
              {quotation.role}
            </Badge>
          </div>
          <p className='line-clamp-2 text-muted-foreground text-sm leading-5'>{quotation.username}</p>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            <Avatar className='size-5 after:rounded-sm'>
              <AvatarFallback className='rounded-sm text-[10px]'>{getInitials(quotation.firstName)}</AvatarFallback>
            </Avatar>
            <span className='text-muted-foreground text-sm'>{quotation.email}</span>
          </div>
          <div className='flex min-w-0 items-center gap-1.5 text-muted-foreground'>
            <span className='truncate text-sm'>{quotation.validUntil}</span>
          </div>
        </div>

        <div className='flex items-center justify-between pt-1'>
          <span className='text-xs font-semibold text-primary'>{quotation.amount}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 min-h-0'>
      <DataKanban<Quotation>
        data={data}
        columns={columns}
        columnKey='status'
        searchKey='firstName'
        searchQuery={searchQuery}
        onMoveCard={handleMoveCard}
        renderCard={renderCard}
        getKey={(q) => q.id}
      />
    </div>
  )
}