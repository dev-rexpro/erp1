"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useForm, useFieldArray, FormProvider, useWatch, Controller } from "react-hook-form";
import { format, parseISO } from "date-fns";
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowLeft,
  ArrowUpDown,
  CalendarIcon,
  Cog,
  Download,
  FileText,
  Grid,
  MoreHorizontal,
  Plus,
  Printer,
  Rows3,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Kbd } from "@/components/ui/kbd";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Scaling hook from invoice components
import { useVisibleCenterPosition } from "@/app/(main)/dashboard/invoice/_components/use-visible-center-position";

type ServiceQuotation = {
  id: string;
  client: string;
  clientAddress: string;
  clientTaxId: string;
  subject: string;
  createdDate: string;
  expiryDate: string;
  amount: number;
  status: "Draft" | "Sent" | "Accepted" | "Expired";
  items: { description: string; qty: number; unitPrice: number }[];
};

const mockQuotations: ServiceQuotation[] = [
  {
    id: "SQ-2026-001",
    client: "Acme Corporation",
    clientAddress: "123 Industrial Way\nSuite 500\nSilicon Valley, CA 94025",
    clientTaxId: "TX-904-8291",
    subject: "Enterprise Cloud Migration Consulting",
    createdDate: "2026-06-12",
    expiryDate: "2026-07-12",
    amount: 85000,
    status: "Sent",
    items: [
      { description: "Cloud Infrastructure Audit & Planning", qty: 1, unitPrice: 15000 },
      { description: "Migration Execution (Kubernetes & AWS)", qty: 1, unitPrice: 50000 },
      { description: "Post-Migration Support & DevOps SLA", qty: 4, unitPrice: 5000 },
    ],
  },
  {
    id: "SQ-2026-002",
    client: "Stark Industries",
    clientAddress: "10880 Malibu Point\nMalibu, CA 90265",
    clientTaxId: "TX-440-2094",
    subject: "AI Automation System Architecture Development",
    createdDate: "2026-06-10",
    expiryDate: "2026-07-10",
    amount: 240000,
    status: "Accepted",
    items: [
      { description: "AI & Neural Network Model Selection Consultation", qty: 1, unitPrice: 80000 },
      { description: "Integrated Automation Framework Implementation", qty: 1, unitPrice: 120000 },
      { description: "Vibranium Sensor Calibration Testing Support", qty: 80, unitPrice: 500 },
    ],
  },
  {
    id: "SQ-2026-003",
    client: "Wayne Enterprises",
    clientAddress: "1007 Mountain Drive\nGotham City, NJ 07001",
    clientTaxId: "TX-129-9402",
    subject: "Cybersecurity Compliance Audit",
    createdDate: "2026-06-08",
    expiryDate: "2026-07-08",
    amount: 45000,
    status: "Draft",
    items: [
      { description: "Bat-Server Penetration Testing & Report", qty: 1, unitPrice: 20000 },
      { description: "Infrastructure Security Compliance Consultation", qty: 1, unitPrice: 25000 },
    ],
  },
  {
    id: "SQ-2026-004",
    client: "Oscorp Technologies",
    clientAddress: "645 Fifth Avenue\nNew York, NY 10022",
    clientTaxId: "TX-550-9304",
    subject: "Laboratory Equipment Support & SLA",
    createdDate: "2026-05-28",
    expiryDate: "2026-06-28",
    amount: 120000,
    status: "Accepted",
    items: [
      { description: "Biochemical Lab Chamber Maintenance Contract", qty: 12, unitPrice: 8000 },
      { description: "Emergency Equipment SLA Callouts", qty: 1, unitPrice: 24000 },
    ],
  },
  {
    id: "SQ-2026-005",
    client: "Umbrella Corp",
    clientAddress: "Raccoon City Underground Facility\nRaccoon City, Midwest",
    clientTaxId: "TX-880-6666",
    subject: "Data Center Maintenance Agreement",
    createdDate: "2026-05-15",
    expiryDate: "2026-06-15",
    amount: 60000,
    status: "Expired",
    items: [
      { description: "Sublevel 4 Mainframe Climate System Maintenance", qty: 4, unitPrice: 10000 },
      { description: "Red Queen AI Core Servers Maintenance Support", qty: 1, unitPrice: 20000 },
    ],
  },
  {
    id: "SQ-2026-006",
    client: "LexCorp",
    clientAddress: "LexCorp Tower, Metropolis\nMetropolis, NY 10001",
    clientTaxId: "TX-330-1111",
    subject: "Robotics Research & Consultancy Support",
    createdDate: "2026-04-20",
    expiryDate: "2026-05-20",
    amount: 310000,
    status: "Accepted",
    items: [
      { description: "Power Armor Structural Engineering Consultation", qty: 1, unitPrice: 150000 },
      { description: "Kryptonite Radiation Shielding System Design", qty: 1, unitPrice: 160000 },
    ],
  },
];

const statusStyles: Record<ServiceQuotation["status"], { badge: string; dot: string }> = {
  Accepted: {
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Sent: {
    badge: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  Draft: {
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Expired: {
    badge: "border-destructive/20 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
};

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 3) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];

  return [currentPage - 1, currentPage, currentPage + 1];
}

const QUOTE_PAPER_WIDTH = 816;
const QUOTE_PAPER_HEIGHT = 1056;
const QUOTE_PAPER_SCALE = 0.7;

function QuotationPaper({ quote }: { quote: ServiceQuotation }) {
  const amount = quote.items?.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0), 0) ?? 0;

  return (
    <article
      style={{ width: QUOTE_PAPER_WIDTH, height: QUOTE_PAPER_HEIGHT }}
      data-print-paper
      className="relative flex flex-col gap-12 bg-neutral-50 px-12 py-12 font-mono text-neutral-950 shadow-md border text-xs leading-normal"
    >
      <header className="flex flex-col gap-6">
        <div className="grid grid-cols-2 items-start gap-12">
          <svg className="size-10 text-stone-700" viewBox="0 0 48 48" aria-hidden="true">
            <rect width="20" height="20" rx="3" fill="currentColor" />
            <rect x="28" width="20" height="20" rx="3" fill="currentColor" />
            <rect y="28" width="20" height="20" rx="3" fill="currentColor" />
            <rect x="28" y="28" width="20" height="20" rx="3" fill="currentColor" />
          </svg>
          <div className="text-right">
            <h2 className="text-3xl font-bold uppercase tracking-widest text-stone-800">Quotation</h2>
            <p className="text-xs mt-1 text-muted-foreground">{quote.id}</p>
          </div>
        </div>

        <section className="grid grid-cols-2 gap-12 text-[11px] leading-relaxed mt-4">
          <div>
            <p className="font-semibold text-stone-700">DATE ISSUED</p>
            <p>{quote.createdDate}</p>
            <p className="font-semibold text-stone-700 mt-2">VALID UNTIL</p>
            <p>{quote.expiryDate}</p>
          </div>
          <div>
            <p className="font-semibold text-stone-700">PREPARED BY</p>
            <p>Weblabs Commercial Team</p>
            <p>support@weblabs.studio</p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-12 text-[11px] leading-relaxed mt-2">
          <div>
            <p className="font-semibold uppercase text-stone-700">Sender</p>
            <p>WebLabs Studio Inc.</p>
            <p>100 Pine Street, Floor 15</p>
            <p>San Francisco, CA 94111</p>
          </div>
          <div>
            <p className="font-semibold uppercase text-stone-700">Client Info</p>
            <p className="font-semibold">{quote.client || "Client Name"}</p>
            {quote.clientAddress ? (
              quote.clientAddress.split("\n").map((line, idx) => <p key={idx}>{line}</p>)
            ) : (
              <p>Address details pending</p>
            )}
            <p>Tax ID: {quote.clientTaxId ?? "N/A"}</p>
          </div>
        </section>
      </header>

      <div className="flex flex-col gap-6 mt-2 flex-1">
        <section className="text-[11px]">
          <div className="grid grid-cols-[1fr_80px_120px_120px] bg-stone-200 px-3 py-2 font-semibold uppercase text-stone-700">
            <span>Description</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Unit Price</span>
            <span className="text-right">Total</span>
          </div>
          {quote.items?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_80px_120px_120px] border-b border-stone-200 px-3 py-3"
            >
              <span className="truncate">{item.description || "(Empty description)"}</span>
              <span className="text-right">{item.qty || 0}</span>
              <span className="text-right">{formatCurrency(item.unitPrice || 0)}</span>
              <span className="text-right">{formatCurrency((item.qty || 0) * (item.unitPrice || 0))}</span>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-2 gap-12 text-[10px] leading-relaxed mt-2">
          <div className="text-stone-500 leading-normal">
            <p className="font-semibold uppercase text-stone-600 mb-1">Terms & Conditions</p>
            <p>1. Work will commence after acceptance signature is returned.</p>
            <p>2. Payment terms: 50% upfront, 50% upon project milestone delivery.</p>
            <p>3. This quote is valid for 30 days from date of issuance.</p>
          </div>
          <section className="col-start-2 space-y-2">
            <div className="border-stone-400 border-t-2 pt-2">
              <div className="flex justify-between gap-8 font-bold text-sm text-stone-800">
                <span className="uppercase">Grand Total</span>
                <span>{formatCurrency(amount)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="absolute right-12 bottom-12 left-12 grid grid-cols-2 gap-12 text-stone-400 text-[10px] leading-relaxed">
        <div>
          <p>www.weblabs.studio</p>
          <p>Phone: +1 (555) 019-2834</p>
        </div>
        <div className="text-right">
          <p>Accepted By: _________________________</p>
          <p className="mt-1">Date: _________________________</p>
        </div>
      </footer>
    </article>
  );
}

function PrintQuotationPortal({ quote }: { quote: ServiceQuotation }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-print-root>
      <QuotationPaper quote={quote} />
    </div>,
    document.body
  );
}

function DatePicker({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const date = parseDateValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          data-empty={!date}
          className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Calendar
          className="w-full"
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) return;

            onChange(format(selectedDate, "yyyy-MM-dd"));
            setOpen(false);
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}

function parseDateValue(value: string) {
  const date = parseISO(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

// Inner Quotation Form Editor component
function QuotationFormEditor({ quote, onSave, onCancel }: { quote: ServiceQuotation; onSave: (data: ServiceQuotation) => void; onCancel: () => void }) {
  const methods = useForm<ServiceQuotation>({
    defaultValues: quote,
  });

  const { control, register, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch fields dynamically to feed into live preview
  const liveFormState = useWatch({ control });
  const liveQuote = { ...quote, ...liveFormState } as ServiceQuotation;

  const previewBodyRef = React.useRef<HTMLDivElement>(null);
  const paperLayout = useVisibleCenterPosition(previewBodyRef, {
    height: QUOTE_PAPER_HEIGHT,
    maxScale: QUOTE_PAPER_SCALE,
    width: QUOTE_PAPER_WIDTH,
  });

  const handlePrint = () => {
    window.print();
  };

  const onSubmit = (data: ServiceQuotation) => {
    const totalAmount = data.items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0), 0);
    onSave({ ...data, amount: totalAmount });
  };

  return (
    <FormProvider {...methods}>
      <PrintQuotationPortal quote={liveQuote} />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 xl:grid-cols-2">
        {/* Left Column: Form Editor (styled exactly like invoice-form) */}
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
          <div className="flex flex-col gap-1 pb-2">
            <h2 className="font-semibold text-lg leading-none tracking-tight">Quotation Detail</h2>
            <p className="text-muted-foreground text-xs">Update quotation items, client details, and pricing values.</p>
          </div>

          <Separator />

          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field className="col-span-2 gap-1">
                <FieldLabel className="text-xs" htmlFor="client-name">Client Name</FieldLabel>
                <Input id="client-name" {...register("client")} placeholder="Client Company Name" />
              </Field>

              <Field className="col-span-2 gap-1">
                <FieldLabel className="text-xs" htmlFor="client-address">Client Address</FieldLabel>
                <Textarea id="client-address" {...register("clientAddress")} rows={3} placeholder="Client Address lines" />
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-xs" htmlFor="client-tax-id">Client Tax ID</FieldLabel>
                <Input id="client-tax-id" {...register("clientTaxId")} placeholder="TX-XXX-XXXX" />
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-xs">Status</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Sent">Sent</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Controller
                control={control}
                name="createdDate"
                render={({ field }) => (
                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="created-date">Issued Date</FieldLabel>
                    <DatePicker id="created-date" value={field.value} onChange={field.onChange} />
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="expiryDate"
                render={({ field }) => (
                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="expiry-date">Valid Until</FieldLabel>
                    <DatePicker id="expiry-date" value={field.value} onChange={field.onChange} />
                  </Field>
                )}
              />

              <Field className="col-span-2 gap-1">
                <FieldLabel className="text-xs" htmlFor="quotation-subject">Quotation Subject</FieldLabel>
                <Input id="quotation-subject" {...register("subject")} placeholder="e.g. Website Consulting Support" />
              </Field>
            </div>
          </FieldGroup>

          <Separator />

          {/* Items List Form Arrays */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-sm">Line Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ description: "", qty: 1, unitPrice: 0 })}
              >
                <Plus className="size-3.5 mr-1" /> Add Line
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start bg-muted/30 p-3 rounded-lg border">
                  <div className="grid grid-cols-12 gap-2 flex-1">
                    <div className="col-span-6">
                      <label className="text-[10px] text-muted-foreground block mb-0.5">Description</label>
                      <Input {...register(`items.${index}.description` as const)} placeholder="Item name" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-muted-foreground block mb-0.5">Qty</label>
                      <Input type="number" {...register(`items.${index}.qty` as const, { valueAsNumber: true })} />
                    </div>
                    <div className="col-span-4">
                      <label className="text-[10px] text-muted-foreground block mb-0.5">Unit Price ($)</label>
                      <Input type="number" {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })} />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-4 text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Right Column: Live Print Preview */}
        <div className="flex flex-col rounded-xl border bg-card">
          <div className="flex items-center justify-between px-4 py-4">
            <h2 className="font-medium text-lg">Print Preview</h2>
            <ButtonGroup>
              <Button type="button" variant="outline" onClick={handlePrint}>
                <Printer data-icon="inline-start" />
                Print
              </Button>
              <Button type="button" variant="outline">
                <Download data-icon="inline-start" />
                Download PDF
              </Button>
            </ButtonGroup>
          </div>

          <div
            ref={previewBodyRef}
            className="@container/preview relative min-h-[calc(100svh-18rem)] flex-1 rounded-b-xl bg-stone-200 p-4 dark:bg-stone-800 overflow-hidden"
          >
            {paperLayout === null ? (
              <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">
                Loading Preview
              </div>
            ) : null}
            <div
              style={{
                height: paperLayout
                  ? QUOTE_PAPER_HEIGHT * paperLayout.scale
                  : QUOTE_PAPER_HEIGHT * QUOTE_PAPER_SCALE,
                top: paperLayout?.top ?? "50%",
                transform: paperLayout === null ? "translate(-50%, -50%)" : "translateX(-50%)",
                width: paperLayout
                  ? QUOTE_PAPER_WIDTH * paperLayout.scale
                  : QUOTE_PAPER_WIDTH * QUOTE_PAPER_SCALE,
              }}
              className="absolute left-1/2 opacity-0 data-[ready=true]:opacity-100"
              data-ready={paperLayout !== null}
            >
              <div
                style={{ transform: `scale(${paperLayout?.scale ?? QUOTE_PAPER_SCALE})` }}
                className="origin-top-left"
              >
                <QuotationPaper quote={liveQuote} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default function ServiceQuotationsPage() {
  const [quotationList, setQuotationList] = React.useState<ServiceQuotation[]>(mockQuotations);
  const [selectedQuote, setSelectedQuote] = React.useState<ServiceQuotation | null>(null);

  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "id", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<ColumnDef<ServiceQuotation>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              aria-label="Select all quotes"
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              aria-label={`Select ${row.original.id}`}
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 h-8 text-sm font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quote ID
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        ),
        cell: ({ row }) => <span className="font-semibold text-primary">{row.original.id}</span>,
      },
      {
        id: "client",
        accessorKey: "client",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 h-8 text-sm font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Client
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        ),
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.client}</span>,
        filterFn: "includesString",
      },
      {
        id: "subject",
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => <span className="text-sm max-w-[260px] truncate block">{row.original.subject}</span>,
      },
      {
        id: "createdDate",
        accessorKey: "createdDate",
        header: "Created Date",
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.createdDate}</span>,
      },
      {
        id: "expiryDate",
        accessorKey: "expiryDate",
        header: "Expiry Date",
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.expiryDate}</span>,
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 h-8 text-sm font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        ),
        cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.amount)}</span>,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const style = statusStyles[row.original.status];
          return (
            <Badge className={`gap-1.5 border px-2 py-0.5 font-medium ${style.badge}`} variant="outline">
              <span className={`size-1.5 rounded-full ${style.dot}`} />
              {row.original.status}
            </Badge>
          );
        },
        filterFn: "equalsString",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => setSelectedQuote(row.original)}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: quotationList,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false,
    enableRowSelection: true,
  });

  const searchQuery = (table.getColumn("client")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "all";

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = Math.min(table.getState().pagination.pageIndex + 1, pageCount);
  const pageNumbers = getPageNumbers(currentPage, pageCount);
  const rowsPerPage = `${table.getState().pagination.pageSize}`;

  const handleSearch = (val: string) => {
    table.getColumn("client")?.setFilterValue(val || undefined);
    table.setPageIndex(0);
  };

  const handleStatusChange = (val: string) => {
    table.getColumn("status")?.setFilterValue(val === "all" ? undefined : val);
    table.setPageIndex(0);
  };

  const handleSaveQuotation = (updatedQuote: ServiceQuotation) => {
    setQuotationList((current) =>
      current.map((q) => (q.id === updatedQuote.id ? updatedQuote : q))
    );
    setSelectedQuote(null);
  };

  if (selectedQuote) {
    return (
      <div className="flex flex-col gap-6">
        {/* Back navigation & title header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setSelectedQuote(null)}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">{selectedQuote.id}</h1>
            <p className="text-muted-foreground text-sm">Quotation editor and document live print preview</p>
          </div>
        </div>

        <QuotationFormEditor
          quote={selectedQuote}
          onSave={handleSaveQuotation}
          onCancel={() => setSelectedQuote(null)}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Service Quotations</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Create, manage, and track quotes and proposals sent to potential and existing clients.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder="Search quotes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <Kbd className="h-4 text-[10px]">⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <Button variant="outline" size="sm">
            <SlidersHorizontal /> Hide
          </Button>
          <Button variant="outline" size="sm">
            <Cog /> Customize
          </Button>
          <Button variant="outline" size="sm">
            <Download /> Export
          </Button>
          <Button size="sm">
            <Plus /> Create Quotation
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-1">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground mr-1">Status:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selection & view toggles */}
        <div className="flex items-center justify-between gap-3 px-4">
          <div className="text-muted-foreground text-sm tabular-nums">{selectedCount} selected</div>

          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list" aria-label="List view">
                <Rows3 />
              </TabsTrigger>
              <TabsTrigger value="grid" aria-label="Grid view">
                <Grid />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4">
            <TableHeader className="[&_tr]:border-t">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="py-4 font-normal">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border/60 hover:bg-white/2.5 cursor-pointer"
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => setSelectedQuote(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-3 py-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground text-sm">
                    No quotations found matching the criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* Pagination bar */}
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20">
                  <SelectValue placeholder={rowsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <span>
              Page {currentPage} of {pageCount}
            </span>
          </div>

          <Pagination className="mx-0 w-auto justify-start md:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text=""
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    table.previousPage();
                  }}
                />
              </PaginationItem>
              {pageNumbers[0] > 1 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              {pageNumbers.map((pageNumber) => (
                <PaginationItem key={`page-${pageNumber}`}>
                  <PaginationLink
                    href="#"
                    isActive={table.getState().pagination.pageIndex === pageNumber - 1}
                    onClick={(e) => {
                      e.preventDefault();
                      table.setPageIndex(pageNumber - 1);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {pageNumbers[pageNumbers.length - 1] < pageCount ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text=""
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    table.nextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
