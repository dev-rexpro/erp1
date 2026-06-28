import { useRef, useMemo, useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch, Controller } from 'react-hook-form'
import { ArrowLeft, Download, Printer, Save, Send, Hash, CalendarIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'

const _defaultQuotationValidUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0]

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

import { type Quotation } from '../data/schema'
import { useQuotations } from './quotations-provider'
import { quotations as staticQuotations } from '../data/quotations'

import {
  INVOICE_PAPER_HEIGHT,
  INVOICE_PAPER_SCALE,
  INVOICE_PAPER_WIDTH,
  defaultInvoiceFrom,
  invoiceClients,
} from '../../client-invoices/components/invoice-form-data'
import { useVisibleCenterPosition } from '../../client-invoices/components/use-visible-center-position'

interface QuotationDetailViewProps {
  data: Quotation[]
}

interface QuotationFormValues {
  quotationNo: string
  validUntil: string
  clientId: string
  clientName: string
  clientEmail: string
  amount: string
  serviceCategory: string
  notes: string
  terms: string
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
          <CalendarIcon className='text-muted-foreground' />
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

export function QuotationDetailView({ data }: QuotationDetailViewProps) {
  const { selectedQuotationId, setSelectedQuotationId } = useQuotations()
  const previewBodyRef = useRef<HTMLDivElement>(null)

  const paperLayout = useVisibleCenterPosition(previewBodyRef, {
    height: INVOICE_PAPER_HEIGHT,
    maxScale: INVOICE_PAPER_SCALE,
    width: INVOICE_PAPER_WIDTH,
  })

  const quotation = useMemo(() => {
    if (selectedQuotationId === 'new') return null
    return data.find((q) => q.id === selectedQuotationId) || null
  }, [data, selectedQuotationId])

  const formDefaults: QuotationFormValues = useMemo(() => {
    if (quotation) {
      const matched = invoiceClients.find(
        (c) => c.name.toLowerCase() === quotation.firstName.toLowerCase()
      )
      return {
        quotationNo: quotation.username,
        validUntil: quotation.validUntil,
        clientId: matched?.id || 'bright-enterprises',
        clientName: quotation.firstName,
        clientEmail: quotation.email,
        amount: quotation.amount,
        serviceCategory: 'Air Freight',
        notes: 'Thank you for your interest in our services. We look forward to a successful business partnership.',
        terms: 'This quotation is valid for 30 days from the date of issue. Prices are net and subject to active freight tariffs.',
      }
    }
    return {
      quotationNo: `QT-2026-${1000 + staticQuotations.length}`,
      validUntil: _defaultQuotationValidUntil,
      clientId: 'bright-enterprises',
      clientName: 'Bright Enterprises',
      clientEmail: 'billing@brightenterprises.com',
      amount: '$8,500.00',
      serviceCategory: 'Air Freight',
      notes: 'Thank you for your interest in our services. We look forward to a successful business partnership.',
      terms: 'This quotation is valid for 30 days from the date of issue. Prices are net and subject to active freight tariffs.',
    }
  }, [quotation])

  const form = useForm<QuotationFormValues>({ defaultValues: formDefaults })
  const w = useWatch({ control: form.control }) as QuotationFormValues

  useEffect(() => {
    form.reset(formDefaults)
  }, [formDefaults, form])

  const activeClient = useMemo(() => {
    return invoiceClients.find((c) => c.id === w.clientId) || invoiceClients[0]
  }, [w.clientId])

  const handleSubmit = () => {
    toast.success(
      selectedQuotationId === 'new'
        ? `Quotation ${w.quotationNo} created!`
        : `Quotation ${w.quotationNo} updated!`
    )
    setSelectedQuotationId(null)
  }

  return (
    <FormProvider {...form}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex flex-col gap-1'>
            <h1 className='font-medium text-3xl leading-none tracking-tight'>
              {selectedQuotationId === 'new' ? 'Create New Quotation' : 'Edit Quotation'}
            </h1>
            <p className='text-muted-foreground text-sm'>
              Set service rates, review the pricing proposal, and share with your client.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <Button variant='outline' size='sm' onClick={() => setSelectedQuotationId(null)} className='h-9 px-3 gap-1.5'>
              <ArrowLeft className='size-4' />
              Back
            </Button>
            <Button type='button' variant='outline' onClick={() => toast.success('Draft saved!')}>
              <Save className='mr-1.5 size-4' />
              Save as Draft
            </Button>
            <Button type='button' onClick={handleSubmit}>
              <Send className='mr-1.5 size-4' />
              Send Quotation
            </Button>
          </div>
        </div>

        <form className='grid gap-5 xl:grid-cols-2' noValidate onSubmit={(e) => e.preventDefault()}>
          <div className='flex flex-col gap-4 rounded-xl border bg-card p-4'>
            <Tabs defaultValue='quotation'>
              <TabsList className='w-full'>
                <TabsTrigger value='quotation'>Quotation</TabsTrigger>
                <TabsTrigger value='terms'>Terms</TabsTrigger>
                <TabsTrigger value='business'>Business</TabsTrigger>
              </TabsList>
            </Tabs>

            <section className='flex flex-col gap-3'>
              <FieldGroup>
                <Field className='gap-1'>
                  <FieldLabel className='text-xs'>Quotation Number</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...form.register('quotationNo')} />
                    <InputGroupAddon align='inline-end'>
                      <Hash />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <div className='grid gap-5 md:grid-cols-2'>
                  <Field className='gap-1'>
                    <FieldLabel className='text-xs'>Valid Until</FieldLabel>
                    <Controller
                      control={form.control}
                      name='validUntil'
                      render={({ field }) => (
                        <DatePicker id='valid-until' value={field.value} onChange={field.onChange} />
                      )}
                    />
                  </Field>
                  <Field className='gap-1'>
                    <FieldLabel className='text-xs'>Total Estimate</FieldLabel>
                    <Input {...form.register('amount')} />
                  </Field>
                </div>
                <Field className='gap-1'>
                  <FieldLabel className='text-xs'>Service Category</FieldLabel>
                  <Select value={w.serviceCategory} onValueChange={(v) => form.setValue('serviceCategory', v)}>
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='Air Freight'>Air Freight</SelectItem>
                        <SelectItem value='Ocean Freight'>Ocean Freight</SelectItem>
                        <SelectItem value='Customs Clearance'>Customs Clearance</SelectItem>
                        <SelectItem value='Warehousing'>Warehousing Logistics</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </section>

            <Separator />

            <section className='flex flex-col gap-4'>
              <h2 className='font-medium tracking-tight'>Prospect Client</h2>
              <Field className='gap-1'>
                <FieldLabel className='text-xs'>Client</FieldLabel>
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
                        <Avatar className='after:rounded-md'>
                          <AvatarFallback className='rounded-md bg-card text-foreground'>
                            {getInitials(activeClient.name).slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='text-left text-xs'>
                          <div>{activeClient.name}</div>
                          <div className='text-muted-foreground'>{activeClient.email}</div>
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
              <h2 className='font-medium tracking-tight'>Notes & Terms</h2>
              <Field className='gap-1'>
                <FieldLabel className='text-xs'>Additional Notes</FieldLabel>
                <Textarea {...form.register('notes')} className='min-h-[80px]' />
              </Field>
              <Field className='gap-1'>
                <FieldLabel className='text-xs'>Validity Terms & Conditions</FieldLabel>
                <Textarea {...form.register('terms')} className='min-h-[100px]' />
              </Field>
            </section>
          </div>

          {/* Right: Preview */}
          <div className='flex flex-col rounded-xl border bg-card'>
            <div className='flex items-center justify-between px-4 py-4'>
              <h2 className='font-medium text-lg'>Preview</h2>
              <div className='flex items-center gap-1'>
                <Button type='button' variant='outline' size='sm' onClick={() => window.print()}>
                  <Printer className='mr-1.5 size-4' />
                  Print
                </Button>
                <Button type='button' variant='outline' size='sm' onClick={() => toast.success('PDF download started!')}>
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
                  <QuotationPaper values={w} client={activeClient} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

function QuotationPaper({ values, client }: { values: QuotationFormValues; client: typeof invoiceClients[0] }) {
  return (
    <article
      style={{ width: INVOICE_PAPER_WIDTH, height: INVOICE_PAPER_HEIGHT }}
      data-print-paper
      className='relative flex flex-col gap-24 bg-neutral-50 px-12.25 py-11 font-mono text-neutral-950'
    >
      <header className='flex flex-col gap-10'>
        <div className='grid grid-cols-2 items-start gap-14'>
          <svg className='size-12' viewBox='0 0 48 48' aria-hidden='true'>
            <rect width='20' height='20' rx='3' fill='currentColor' />
            <rect x='28' width='20' height='20' rx='3' fill='currentColor' />
            <rect y='28' width='20' height='20' rx='3' fill='currentColor' />
            <rect x='28' y='28' width='20' height='20' rx='3' fill='currentColor' />
          </svg>
          <h2 className='text-4xl uppercase tracking-widest'>Quotation</h2>
        </div>

        <section className='grid grid-cols-2 gap-14 text-sm leading-relaxed'>
          <div>
            <p>Reference: {values.quotationNo}</p>
            <p>Valid until: {values.validUntil}</p>
            <p>Service: {values.serviceCategory}</p>
          </div>
          <div>
            <p>Estimated engagement</p>
            <p className='font-semibold'>{values.amount}</p>
          </div>
        </section>

        <section className='grid grid-cols-2 gap-14 text-sm leading-relaxed'>
          <div>
            <p className='mb-4 font-semibold uppercase'>From</p>
            <p>{defaultInvoiceFrom.name}</p>
            {defaultInvoiceFrom.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>Tax ID: {defaultInvoiceFrom.taxId}</p>
          </div>
          <div>
            <p className='mb-4 font-semibold uppercase'>Prepared for</p>
            <p>{client.name}</p>
            {client.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>Tax ID: {client.taxId}</p>
          </div>
        </section>
      </header>

      <div className='flex flex-col gap-6 text-sm leading-relaxed'>
        <section>
          <h3 className='font-semibold uppercase mb-2'>Notes</h3>
          <p className='whitespace-pre-line'>{values.notes}</p>
        </section>
        <section>
          <h3 className='font-semibold uppercase mb-2'>Terms & Conditions</h3>
          <p className='whitespace-pre-line'>{values.terms}</p>
        </section>
      </div>

      <footer className='absolute right-12.25 bottom-11 left-12.25 grid grid-cols-2 gap-14 text-neutral-500 text-sm leading-relaxed'>
        <div>
          <p>{defaultInvoiceFrom.email}</p>
          <p>{defaultInvoiceFrom.phone}</p>
          <p>{defaultInvoiceFrom.website}</p>
        </div>
        <div>
          <p>Prepared for prompt processing.</p>
          <p>Issued by {defaultInvoiceFrom.issuerName}</p>
        </div>
      </footer>
    </article>
  )
}
