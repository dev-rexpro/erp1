import { useRef, useMemo, useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch, Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { ArrowLeft, Download, Printer, Save, Send, Hash, CalendarIcon, Plus, Trash2, GripVertical } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'

const _defaultPackingDate = new Date().toISOString().split('T')[0]

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { getInitials } from '@/lib/utils'

import { type PackingList } from '../data/schema'
import { usePackingLists } from './packing-lists-provider'
import { packingLists as staticPackingLists } from '../data/packing-lists'

import {
  INVOICE_PAPER_HEIGHT,
  INVOICE_PAPER_SCALE,
  INVOICE_PAPER_WIDTH,
  defaultInvoiceFrom,
  invoiceClients,
} from '../../client-invoices/components/invoice-form-data'
import { useVisibleCenterPosition } from '../../client-invoices/components/use-visible-center-position'

interface PackingListDetailViewProps {
  data: PackingList[]
}

interface PackingListItem {
  id: string
  description: string
  quantity: number
  packages: string
  weight: string
  volume: string
}

interface PackingListFormValues {
  packingListNo: string
  packingDate: string
  clientId: string
  clientName: string
  clientEmail: string
  amount: string
  formatType: string
  origin: string
  destination: string
  notes: string
  terms: string
  items: PackingListItem[]
}

function DatePicker({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const date = parseDateValue(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant='outline'
          data-empty={!date}
          className='w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground'
        >
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
          <CalendarIcon className='text-muted-foreground size-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) return
            onChange(format(selectedDate, 'yyyy-MM-dd'))
            setOpen(false)
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}

function parseDateValue(value: string) {
  const date = parseISO(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function PackingListDetailView({ data }: PackingListDetailViewProps) {
  const { selectedPackingListId, setSelectedPackingListId } = usePackingLists()
  const previewBodyRef = useRef<HTMLDivElement>(null)

  const paperLayout = useVisibleCenterPosition(previewBodyRef, {
    height: INVOICE_PAPER_HEIGHT,
    maxScale: INVOICE_PAPER_SCALE,
    width: INVOICE_PAPER_WIDTH,
  })

  const packingList = useMemo(() => {
    if (selectedPackingListId === 'new') return null
    return data.find((p) => p.id === selectedPackingListId) || null
  }, [data, selectedPackingListId])

  const formDefaults: PackingListFormValues = useMemo(() => {
    if (packingList) {
      const matched = invoiceClients.find(
        (c) => c.name.toLowerCase() === packingList.firstName.toLowerCase()
      )
      
      const formatMap: Record<string, string> = {
        superadmin: 'Cartons',
        admin: 'Pallets',
        manager: 'Wooden Crates',
        cashier: 'Containers',
      }

      return {
        packingListNo: packingList.username,
        packingDate: packingList.validUntil,
        clientId: matched?.id || 'bright-enterprises',
        clientName: packingList.firstName,
        clientEmail: packingList.email,
        amount: packingList.amount,
        formatType: formatMap[packingList.role] || 'Cartons',
        origin: 'Global Logistics Hub, ID',
        destination: 'Receiving Dock East, SG',
        notes: 'Cartons are stackable. Please handle with care. Sensitive electronics enclosed.',
        terms: 'All items are inspected prior to dispatch. Client is responsible for checking seals upon receipt.',
        items: [
          { id: 'item-1', description: 'Industrial Power Inverters', quantity: 4, packages: '2 Crates', weight: '340 kg', volume: '1.20 cbm' },
          { id: 'item-2', description: 'Spare Circuit Boards', quantity: 15, packages: '1 Carton', weight: '18 kg', volume: '0.06 cbm' },
        ]
      }
    }
    return {
      packingListNo: `PL-2026-${1000 + staticPackingLists.length}`,
      packingDate: _defaultPackingDate,
      clientId: 'bright-enterprises',
      clientName: 'Bright Enterprises',
      clientEmail: 'billing@brightenterprises.com',
      amount: '3 Cartons',
      formatType: 'Cartons',
      origin: '',
      destination: '',
      notes: '',
      terms: 'All items are inspected prior to dispatch. Client is responsible for checking seals upon receipt.',
      items: [
        { id: 'item-1', description: 'Consumer Electronics (Sensors)', quantity: 250, packages: '1 Carton', weight: '45 kg', volume: '0.12 cbm' },
        { id: 'item-2', description: 'Lithium Battery Packs (UN3480)', quantity: 10, packages: '1 Carton', weight: '12 kg', volume: '0.04 cbm' },
        { id: 'item-3', description: 'Connecting Copper Cables', quantity: 500, packages: '1 Carton', weight: '35 kg', volume: '0.08 cbm' },
      ]
    }
  }, [packingList])

  const form = useForm<PackingListFormValues>({ defaultValues: formDefaults })
  const w = useWatch({ control: form.control }) as PackingListFormValues

  useEffect(() => {
    form.reset(formDefaults)
  }, [formDefaults, form])

  const activeClient = useMemo(() => {
    return invoiceClients.find((c) => c.id === w.clientId) || invoiceClients[0]
  }, [w.clientId])

  const handleSubmit = () => {
    toast.success(
      selectedPackingListId === 'new'
        ? `Packing list ${w.packingListNo} created!`
        : `Packing list ${w.packingListNo} updated!`
    )
    setSelectedPackingListId(null)
  }

  return (
    <FormProvider {...form}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex flex-col gap-1'>
            <h1 className='font-medium text-3xl leading-none tracking-tight'>
              {selectedPackingListId === 'new' ? 'Create Packing List' : 'Edit Packing List'}
            </h1>
            <p className='text-muted-foreground text-sm'>
              Set package quantities, review inventory, and prepare the printable manifest document.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <Button variant='outline' size='sm' onClick={() => setSelectedPackingListId(null)} className='h-9 px-3 gap-1.5'>
              <ArrowLeft className='size-4' />
              Back
            </Button>
            <Button type='button' variant='outline' onClick={() => toast.success('Manifest draft saved!')}>
              <Save className='mr-1.5 size-4' />
              Save Draft
            </Button>
            <Button type='button' onClick={handleSubmit}>
              <Send className='mr-1.5 size-4' />
              Approve Packing List
            </Button>
          </div>
        </div>

        <form className='grid gap-5 xl:grid-cols-2' noValidate onSubmit={(e) => e.preventDefault()}>
          <div className='flex flex-col gap-4 rounded-xl border bg-card p-4'>
            <Tabs defaultValue='manifest'>
              <TabsList className='w-full'>
                <TabsTrigger value='manifest'>Manifest Details</TabsTrigger>
                <TabsTrigger value='routing'>Routing Info</TabsTrigger>
                <TabsTrigger value='notes'>Notes</TabsTrigger>
              </TabsList>
            </Tabs>

            <section className='flex flex-col gap-3'>
              <FieldGroup>
                <Field className='gap-1'>
                  <FieldLabel className='text-xs'>Packing List Number</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...form.register('packingListNo')} />
                    <InputGroupAddon align='inline-end'>
                      <Hash className='size-4 text-muted-foreground' />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <div className='grid gap-5 md:grid-cols-2'>
                  <Field className='gap-1'>
                    <FieldLabel className='text-xs'>Packing Date</FieldLabel>
                    <Controller
                      control={form.control}
                      name='packingDate'
                      render={({ field }) => (
                        <DatePicker id='packing-date' value={field.value} onChange={field.onChange} />
                      )}
                    />
                  </Field>
                  <Field className='gap-1'>
                    <FieldLabel className='text-xs'>Package Count Details</FieldLabel>
                    <Input {...form.register('amount')} />
                  </Field>
                </div>
                <Field className='gap-1'>
                  <FieldLabel className='text-xs'>Packaging Format</FieldLabel>
                  <Select value={w.formatType} onValueChange={(v) => form.setValue('formatType', v)}>
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='Cartons'>Cartons</SelectItem>
                        <SelectItem value='Pallets'>Pallets</SelectItem>
                        <SelectItem value='Wooden Crates'>Wooden Crates</SelectItem>
                        <SelectItem value='Containers'>Containers</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </section>

            <Separator />

            <PackingListItemsEditor />

            <Separator />

            <section className='flex flex-col gap-4'>
              <h2 className='font-medium tracking-tight text-sm'>Consignee Client</h2>
              <Field className='gap-1'>
                <FieldLabel className='text-xs'>Client Account</FieldLabel>
                <Select
                  value={w.clientId}
                  onValueChange={(id) => {
                    const c = invoiceClients.find((x) => x.id === id)
                    if (c) {
                      form.setValue('clientId', c.id)
                      form.setValue('clientName', c.name)
                      form.setValue('clientEmail', c.email)
                    }
                  }}
                >
                  <SelectTrigger className='w-full data-[size=default]:h-auto'>
                    <SelectValue placeholder='Select client'>
                      <div className='flex items-center gap-1.5'>
                        <Avatar className='after:rounded-md size-7'>
                          <AvatarFallback className='rounded-md bg-muted text-foreground text-[10px]'>
                            {getInitials(activeClient.name).slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='text-left text-xs'>
                          <div>{activeClient.name}</div>
                          <div className='text-muted-foreground text-[10px]'>{activeClient.email}</div>
                        </div>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectGroup>
                      {invoiceClients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </section>

            <Separator />

            <section className='flex flex-col gap-4'>
              <h2 className='font-medium tracking-tight text-sm'>Routing Port info</h2>
              <div className='grid gap-5 md:grid-cols-2'>
                <Field className='gap-1'>
                  <FieldLabel className='text-xs'>Loading Port</FieldLabel>
                  <Input {...form.register('origin')} placeholder='e.g., Shanghai Port' />
                </Field>
                <Field className='gap-1'>
                  <FieldLabel className='text-xs'>Discharge Port</FieldLabel>
                  <Input {...form.register('destination')} placeholder='e.g., Rotterdam Port' />
                </Field>
              </div>
            </section>

            <Separator />

            <section className='flex flex-col gap-4'>
              <h2 className='font-medium tracking-tight text-sm'>Notes & Declarations</h2>
              <Field className='gap-1'>
                <FieldLabel className='text-xs'>Manifest Notes / Additional info</FieldLabel>
                <Textarea {...form.register('notes')} className='min-h-[80px]' />
              </Field>
              <Field className='gap-1'>
                <FieldLabel className='text-xs'>Inspection Terms</FieldLabel>
                <Textarea {...form.register('terms')} className='min-h-[80px]' />
              </Field>
            </section>
          </div>

          {/* Right: A4 Document Print Preview */}
          <div className='flex flex-col rounded-xl border bg-card'>
            <div className='flex items-center justify-between px-4 py-4'>
              <h2 className='font-medium text-lg'>Manifest Document</h2>
              <div className='flex items-center gap-1'>
                <Button type='button' variant='outline' size='sm' onClick={() => window.print()}>
                  <Printer className='mr-1.5 size-4' />
                  Print
                </Button>
                <Button type='button' variant='outline' size='sm' onClick={() => toast.success('PDF Manifest generated!')}>
                  <Download className='mr-1.5 size-4' />
                  Download PDF
                </Button>
              </div>
            </div>

            <div
              ref={previewBodyRef}
              className='relative min-h-[calc(100svh-15rem)] flex-1 rounded-b-xl bg-stone-200 p-4 dark:bg-stone-800'
            >
              {paperLayout === null ? (
                <div className='absolute inset-0 grid place-items-center text-muted-foreground text-sm'>
                  Loading Preview
                </div>
              ) : null}
              <div
                style={{
                  height: paperLayout ? INVOICE_PAPER_HEIGHT * paperLayout.scale : INVOICE_PAPER_HEIGHT * INVOICE_PAPER_SCALE,
                  top: paperLayout?.top ?? '50%',
                  transform: paperLayout === null ? 'translate(-50%, -50%)' : 'translateX(-50%)',
                  width: paperLayout ? INVOICE_PAPER_WIDTH * paperLayout.scale : INVOICE_PAPER_WIDTH * INVOICE_PAPER_SCALE,
                }}
                className='absolute left-1/2 opacity-0 data-[ready=true]:opacity-100'
                data-ready={paperLayout !== null}
              >
                <div
                  style={{ transform: `scale(${paperLayout?.scale ?? INVOICE_PAPER_SCALE})` }}
                  className='origin-top-left'
                >
                  <PackingListPaper values={w} client={activeClient} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

function PackingListItemsEditor() {
  const { control, register } = useFormContext<PackingListFormValues>()
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldKey',
  })

  function handleAddItem() {
    append({ id: `item-${Date.now()}`, description: '', quantity: 1, packages: '1 Carton', weight: '10 kg', volume: '0.05 cbm' })
  }

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='font-medium tracking-tight text-sm'>Manifest Line Items</h2>
        <Button type='button' variant='ghost' size='sm' onClick={handleAddItem} className='h-8 px-2.5 gap-1.5'>
          <Plus className='size-4' />
          Add Cargo Item
        </Button>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='hidden items-center gap-2 px-1 font-medium text-muted-foreground text-xs md:grid md:grid-cols-[24px_minmax(0,1.5fr)_70px_110px_90px_90px_32px]'>
          <span />
          <span>Description of Goods</span>
          <span className='px-2'>Qty</span>
          <span className='px-2'>Packages</span>
          <span className='px-2'>Weight</span>
          <span className='px-2'>Volume</span>
          <span />
        </div>

        <div className='flex flex-col gap-3'>
          {fields.map((field, index) => (
            <div
              key={field.fieldKey}
              className='grid min-w-0 grid-cols-[24px_1fr_32px] items-center gap-2 rounded-lg md:grid-cols-[24px_minmax(0,1.5fr)_70px_110px_90px_90px_32px]'
            >
              <Button
                type='button'
                variant='ghost'
                className='h-6 w-6 -ml-1 cursor-grab text-muted-foreground active:cursor-grabbing'
                aria-label={`Reorder item ${index + 1}`}
              >
                <GripVertical className='size-3.5' />
              </Button>
              <Input
                className='min-w-0 text-sm max-md:col-span-3'
                placeholder='e.g., iPhone 15 Pro Max'
                {...register(`items.${index}.description` as const)}
              />
              <Input
                type='number'
                className='text-sm max-md:col-start-2 max-md:row-start-2'
                placeholder='Qty'
                {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
              />
              <Input
                className='text-sm max-md:col-start-3 max-md:row-start-2'
                placeholder='Packages'
                {...register(`items.${index}.packages` as const)}
              />
              <Input
                className='text-sm max-md:col-start-4 max-md:row-start-2'
                placeholder='Weight'
                {...register(`items.${index}.weight` as const)}
              />
              <Input
                className='text-sm'
                placeholder='Volume'
                {...register(`items.${index}.volume` as const)}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                aria-label={`Remove item ${index + 1}`}
                onClick={() => remove(index)}
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          ))}
          {fields.length === 0 && (
            <div className='text-center py-4 border border-dashed rounded-lg text-xs text-muted-foreground'>
              No items declared. Click "Add Cargo Item" to declare.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function PackingListPaper({ values, client }: { values: PackingListFormValues; client: typeof invoiceClients[0] }) {
  return (
    <article
      style={{ width: INVOICE_PAPER_WIDTH, height: INVOICE_PAPER_HEIGHT }}
      data-print-paper
      className='relative flex flex-col gap-8 bg-neutral-50 px-12 py-11 font-mono text-neutral-950 text-xs'
    >
      <header className='flex flex-col gap-6'>
        <div className='grid grid-cols-2 items-start gap-14'>
          <svg className='size-12' viewBox='0 0 48 48' aria-hidden='true'>
            <rect width='20' height='20' rx='3' fill='currentColor' />
            <rect x='28' width='20' height='20' rx='3' fill='currentColor' />
            <rect y='28' width='20' height='20' rx='3' fill='currentColor' />
            <rect x='28' y='28' width='20' height='20' rx='3' fill='currentColor' />
          </svg>
          <h2 className='text-3xl uppercase tracking-widest text-right'>Packing List</h2>
        </div>

        <section className='grid grid-cols-2 gap-14 leading-relaxed border-t border-b py-3 text-[11px]'>
          <div>
            <p>Manifest Ref: {values.packingListNo}</p>
            <p>Packing Date: {values.packingDate}</p>
            <p>Format / Type: {values.formatType}</p>
          </div>
          <div>
            <p>Total Consignment Count</p>
            <p className='font-semibold'>{values.amount}</p>
          </div>
        </section>

        <section className='grid grid-cols-2 gap-14 leading-relaxed text-[11px]'>
          <div>
            <p className='mb-2 font-semibold uppercase text-[10px] text-neutral-500'>Shipper / From</p>
            <p className='font-bold'>{defaultInvoiceFrom.name}</p>
            {defaultInvoiceFrom.addressLines.slice(0, 2).map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>Tax ID: {defaultInvoiceFrom.taxId}</p>
          </div>
          <div>
            <p className='mb-2 font-semibold uppercase text-[10px] text-neutral-500'>Consignee / Prepared for</p>
            <p className='font-bold'>{client.name}</p>
            {client.addressLines.slice(0, 2).map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>Tax ID: {client.taxId}</p>
          </div>
        </section>
      </header>

      <div className='flex flex-col gap-5 leading-relaxed flex-grow text-[11px] mb-16'>
        <section className='border-t pt-3'>
          <h3 className='font-semibold uppercase mb-1.5 text-[10px] text-neutral-500'>Port Routing Details</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <span className='font-bold'>Port of Loading:</span> {values.origin || 'N/A'}
            </div>
            <div>
              <span className='font-bold'>Port of Discharge:</span> {values.destination || 'N/A'}
            </div>
          </div>
        </section>

        {/* Itemized Manifest Table */}
        <section className='border-t pt-3 flex-grow min-h-0 overflow-auto'>
          <h3 className='font-semibold uppercase mb-2 text-[10px] text-neutral-500'>Itemized Packing Manifest</h3>
          <table className='w-full text-left text-[11px] border-collapse'>
            <thead>
              <tr className='border-b border-neutral-300 text-neutral-500 uppercase text-[10px]'>
                <th className='pb-1 font-semibold'>Description of Goods</th>
                <th className='pb-1 font-semibold text-right'>Qty</th>
                <th className='pb-1 font-semibold text-right'>Pkgs</th>
                <th className='pb-1 font-semibold text-right'>Weight</th>
                <th className='pb-1 font-semibold text-right'>Volume</th>
              </tr>
            </thead>
            <tbody>
              {values.items?.map((item) => (
                <tr key={item.id} className='border-b border-neutral-200'>
                  <td className='py-1 font-medium'>{item.description || 'N/A'}</td>
                  <td className='py-1 text-right tabular-nums'>{item.quantity}</td>
                  <td className='py-1 text-right'>{item.packages || 'N/A'}</td>
                  <td className='py-1 text-right'>{item.weight || 'N/A'}</td>
                  <td className='py-1 text-right'>{item.volume || 'N/A'}</td>
                </tr>
              ))}
              {(!values.items || values.items.length === 0) && (
                <tr>
                  <td colSpan={5} className='py-4 text-center text-neutral-400'>
                    No items declared on manifest.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {values.notes && (
          <section className='border-t pt-3'>
            <h3 className='font-semibold uppercase mb-1 text-[10px] text-neutral-500'>Manifest Notes</h3>
            <p className='whitespace-pre-line bg-neutral-100 p-2.5 rounded-md text-[10px]'>{values.notes}</p>
          </section>
        )}

        <section className='border-t pt-3'>
          <h3 className='font-semibold uppercase mb-1 text-[10px] text-neutral-500'>Terms & Compliance Declarations</h3>
          <p className='text-neutral-600 leading-normal text-[10px]'>{values.terms}</p>
        </section>
      </div>

      <footer className='absolute right-12 bottom-11 left-12 border-t pt-3 grid grid-cols-2 gap-14 text-neutral-500 leading-relaxed text-[10px]'>
        <div>
          <p>{defaultInvoiceFrom.email}</p>
          <p>{defaultInvoiceFrom.phone}</p>
        </div>
        <div className='text-right'>
          <p>Issued by {defaultInvoiceFrom.issuerName}</p>
          <p>Logistics Manifest Verification Dept.</p>
        </div>
      </footer>
    </article>
  )
}
