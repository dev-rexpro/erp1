"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useForm, FormProvider, useWatch, Controller } from "react-hook-form";
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
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  CalendarIcon,
  CheckCircle2,
  Clock,
  Cog,
  Download,
  Grid,
  MoreHorizontal,
  Plus,
  Printer,
  Rows3,
  Search,
  SlidersHorizontal,
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
import { Progress } from "@/components/ui/progress";
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

type ClientContract = {
  id: string;
  client: string;
  clientAddress: string;
  clientTaxId: string;
  type: string;
  startDate: string;
  endDate: string;
  value: string;
  numericValue: number;
  progress: number;
  status: "Active" | "Expiring" | "Renewed";
  scopeOfWork: string;
  billingFrequency: string;
};

const mockContracts: ClientContract[] = [
  {
    id: "CON-2026-904",
    client: "Acme Corporation",
    clientAddress: "123 Industrial Way\nSuite 500\nSilicon Valley, CA 94025",
    clientTaxId: "TX-904-8291",
    type: "SLA Support",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    value: "$12,500 / mo",
    numericValue: 150000,
    progress: 50,
    status: "Active",
    scopeOfWork: "Standard SLA support including 24/7 server monitoring, bug fixing, and 4 hours maximum response time for critical issues.",
    billingFrequency: "Monthly Invoice",
  },
  {
    id: "CON-2026-905",
    client: "Stark Industries",
    clientAddress: "10880 Malibu Point\nMalibu, CA 90265",
    clientTaxId: "TX-440-2094",
    type: "Enterprise Licensing",
    startDate: "2026-03-15",
    endDate: "2027-03-14",
    value: "$85,000 / yr",
    numericValue: 85000,
    progress: 25,
    status: "Active",
    scopeOfWork: "Full site access keys to Weblabs AI Automation suite for up to 500 active employees.",
    billingFrequency: "Annual upfront payment",
  },
  {
    id: "CON-2026-906",
    client: "Wayne Enterprises",
    clientAddress: "1007 Mountain Drive\nGotham City, NJ 07001",
    clientTaxId: "TX-129-9402",
    type: "Retainer (Security)",
    startDate: "2026-01-10",
    endDate: "2026-07-10",
    value: "$25,000 / mo",
    numericValue: 300000,
    progress: 88,
    status: "Expiring",
    scopeOfWork: "Dedicated security engineers available on call. Custom network pen testing twice a month.",
    billingFrequency: "Monthly Retainer Billing",
  },
  {
    id: "CON-2026-907",
    client: "Oscorp Technologies",
    clientAddress: "645 Fifth Avenue\nNew York, NY 10022",
    clientTaxId: "TX-550-9304",
    type: "Project-Based",
    startDate: "2026-04-01",
    endDate: "2026-09-30",
    value: "$180,000 Total",
    numericValue: 180000,
    progress: 42,
    status: "Active",
    scopeOfWork: "Development of lab inventory tracking dashboard and integration with existing biochemical hardware.",
    billingFrequency: "Milestone completion billing (30% / 40% / 30%)",
  },
  {
    id: "CON-2026-908",
    client: "Umbrella Corp",
    clientAddress: "Raccoon City Underground Facility\nRaccoon City, Midwest",
    clientTaxId: "TX-880-6666",
    type: "SLA Support",
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    value: "$8,000 / mo",
    numericValue: 96000,
    progress: 100,
    status: "Renewed",
    scopeOfWork: "Standard SLA system infrastructure monitoring for underground servers.",
    billingFrequency: "Monthly invoice billing",
  },
  {
    id: "CON-2026-909",
    client: "LexCorp",
    clientAddress: "LexCorp Tower, Metropolis\nMetropolis, NY 10001",
    clientTaxId: "TX-330-1111",
    type: "Enterprise Licensing",
    startDate: "2026-02-01",
    endDate: "2027-01-31",
    value: "$120,000 / yr",
    numericValue: 120000,
    progress: 33,
    status: "Active",
    scopeOfWork: "Metropolis office licensing for Weblabs ERP automation components.",
    billingFrequency: "Annual payment",
  },
];

const statusStyles: Record<ClientContract["status"], { badge: string; dot?: string }> = {
  Active: {
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Renewed: {
    badge: "border-border bg-muted/50 text-muted-foreground",
  },
  Expiring: {
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
};

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 3) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];

  return [currentPage - 1, currentPage, currentPage + 1];
}

const CONTRACT_PAPER_WIDTH = 816;
const CONTRACT_PAPER_HEIGHT = 1056;
const CONTRACT_PAPER_SCALE = 0.7;

function ContractPaper({ contract }: { contract: ClientContract }) {
  return (
    <article
      style={{ width: CONTRACT_PAPER_WIDTH, height: CONTRACT_PAPER_HEIGHT }}
      data-print-paper
      className="relative flex flex-col gap-10 bg-neutral-50 px-12 py-12 font-serif text-neutral-900 shadow-md border text-sm"
    >
      <header className="flex flex-col gap-4 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-stone-800">
          Service Contract Agreement
        </h2>
        <p className="text-xs text-muted-foreground font-mono">Contract ID: {contract.id}</p>
        <div className="w-16 h-1 bg-stone-700 mx-auto mt-2" />
      </header>

      <div className="flex flex-col gap-4 mt-4 leading-relaxed text-justify">
        <p>
          This Service Contract Agreement (the <strong>&quot;Agreement&quot;</strong>) is entered into and made effective as of{" "}
          <strong>{contract.startDate}</strong>, by and between:
        </p>

        <div className="grid grid-cols-2 gap-8 pl-4 my-2 text-xs font-sans">
          <div>
            <p className="font-bold uppercase text-stone-700">SERVICE PROVIDER</p>
            <p className="font-semibold text-stone-900">WebLabs Studio Inc.</p>
            <p>100 Pine Street, Floor 15</p>
            <p>San Francisco, CA 94111</p>
          </div>
          <div>
            <p className="font-bold uppercase text-stone-700">CLIENT</p>
            <p className="font-semibold text-stone-900">{contract.client || "Client Name"}</p>
            {contract.clientAddress ? (
              contract.clientAddress.split("\n").map((line, idx) => <p key={idx}>{line}</p>)
            ) : (
              <p>Address details pending</p>
            )}
            <p>Tax ID: {contract.clientTaxId ?? "N/A"}</p>
          </div>
        </div>

        <h3 className="font-bold text-stone-800 border-b pb-1 mt-2 text-xs font-sans uppercase">
          1. Scope of Services
        </h3>
        <p className="text-xs">
          The Service Provider agrees to perform the services as defined under the Contract Type of{" "}
          <strong>{contract.type}</strong>. Specifically: {contract.scopeOfWork || "(No Scope of Work specified)"}
        </p>

        <h3 className="font-bold text-stone-800 border-b pb-1 mt-2 text-xs font-sans uppercase">
          2. Term and Duration
        </h3>
        <p className="text-xs">
          This Agreement shall commence on <strong>{contract.startDate}</strong> and shall continue in full force
          and effect until <strong>{contract.endDate}</strong>, unless terminated earlier in accordance with the
          terms specified herein.
        </p>

        <h3 className="font-bold text-stone-800 border-b pb-1 mt-2 text-xs font-sans uppercase">
          3. Payment and Fees
        </h3>
        <p className="text-xs">
          The Client agrees to pay the Service Provider a total value of <strong>{contract.value}</strong>.
          Payments shall be processed under the billing structure of: <strong>{contract.billingFrequency}</strong>.
        </p>

        <h3 className="font-bold text-stone-800 border-b pb-1 mt-2 text-xs font-sans uppercase">
          4. Confidentiality
        </h3>
        <p className="text-xs text-[10px] text-stone-500 leading-normal">
          Both parties agree to hold in confidence all proprietary information, software code, databases, trade secrets, and internal operations acquired during the performance of this agreement. Neither party shall disclose such information to any third party without prior written consent.
        </p>
      </div>

      <footer className="absolute right-12 bottom-12 left-12 grid grid-cols-2 gap-12 font-sans text-stone-500 text-xs mt-12 pt-8 border-t border-stone-200">
        <div>
          <p className="font-semibold text-stone-700">For Weblabs Studio:</p>
          <p className="mt-8 border-b border-stone-400 w-48"></p>
          <p className="text-[10px] mt-1">Authorized Representative</p>
        </div>
        <div>
          <p className="font-semibold text-stone-700">For {contract.client || "Client"}:</p>
          <p className="mt-8 border-b border-stone-400 w-48"></p>
          <p className="text-[10px] mt-1">Authorized Signatory</p>
        </div>
      </footer>
    </article>
  );
}

function PrintContractPortal({ contract }: { contract: ClientContract }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-print-root>
      <ContractPaper contract={contract} />
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

// Inner Contract Form Editor component
function ContractFormEditor({ contract, onSave, onCancel }: { contract: ClientContract; onSave: (data: ClientContract) => void; onCancel: () => void }) {
  const methods = useForm<ClientContract>({
    defaultValues: contract,
  });

  const { control, register, handleSubmit } = methods;

  // Watch fields dynamically to feed into live preview
  const liveFormState = useWatch({ control });
  const liveContract = { ...contract, ...liveFormState } as ClientContract;

  const previewBodyRef = React.useRef<HTMLDivElement>(null);
  const paperLayout = useVisibleCenterPosition(previewBodyRef, {
    height: CONTRACT_PAPER_HEIGHT,
    maxScale: CONTRACT_PAPER_SCALE,
    width: CONTRACT_PAPER_WIDTH,
  });

  const handlePrint = () => {
    window.print();
  };

  const onSubmit = (data: ClientContract) => {
    onSave(data);
  };

  return (
    <FormProvider {...methods}>
      <PrintContractPortal contract={liveContract} />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 xl:grid-cols-2">
        {/* Left Column: Form Editor */}
        <div className="flex flex-col gap-5">
          {/* Main Form Fields Container (styled exactly like invoice-form) */}
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
            <div className="flex flex-col gap-1 pb-2">
              <h2 className="font-semibold text-lg leading-none tracking-tight">Contract Detail</h2>
              <p className="text-muted-foreground text-xs">Update general client details, type, scope of work, and billing schedule.</p>
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
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Expiring">Expiring</SelectItem>
                          <SelectItem value="Renewed">Renewed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-xs" htmlFor="start-date">Start Date</FieldLabel>
                      <DatePicker id="start-date" value={field.value} onChange={field.onChange} />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-xs" htmlFor="end-date">End Date</FieldLabel>
                      <DatePicker id="end-date" value={field.value} onChange={field.onChange} />
                    </Field>
                  )}
                />

                <Field className="gap-1">
                  <FieldLabel className="text-xs">Contract Type</FieldLabel>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SLA Support">SLA Support</SelectItem>
                          <SelectItem value="Enterprise Licensing">Enterprise Licensing</SelectItem>
                          <SelectItem value="Retainer (Security)">Retainer (Security)</SelectItem>
                          <SelectItem value="Project-Based">Project-Based</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field className="gap-1">
                  <FieldLabel className="text-xs" htmlFor="billing-cycle">Billing Cycle</FieldLabel>
                  <Input id="billing-cycle" {...register("billingFrequency")} placeholder="e.g. Monthly Retainer Billing" />
                </Field>

                <Field className="gap-1">
                  <FieldLabel className="text-xs" htmlFor="total-value">Total Value String</FieldLabel>
                  <Input id="total-value" {...register("value")} placeholder="e.g. $12,500 / mo" />
                </Field>

                <Field className="gap-1">
                  <FieldLabel className="text-xs" htmlFor="progress-pct">Progress (%)</FieldLabel>
                  <Input id="progress-pct" type="number" min={0} max={100} {...register("progress", { valueAsNumber: true })} />
                </Field>

                <Field className="col-span-2 gap-1">
                  <FieldLabel className="text-xs" htmlFor="scope-work">Scope of Work</FieldLabel>
                  <Textarea id="scope-work" {...register("scopeOfWork")} rows={4} placeholder="Contract details scope of support..." />
                </Field>
              </div>
            </FieldGroup>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Save Contract
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Milestones Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 text-xs">
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="size-4 text-green-500" />
                  <div className="w-0.5 h-full bg-muted mt-1" />
                </div>
                <div>
                  <p className="font-medium">Contract Signed</p>
                  <p className="text-muted-foreground">Executed on {contract.startDate}</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex flex-col items-center">
                  <Clock className="size-4 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">Current Progress</p>
                  <p className="text-muted-foreground">{liveContract.progress}% term elapsed</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  ? CONTRACT_PAPER_HEIGHT * paperLayout.scale
                  : CONTRACT_PAPER_HEIGHT * CONTRACT_PAPER_SCALE,
                top: paperLayout?.top ?? "50%",
                transform: paperLayout === null ? "translate(-50%, -50%)" : "translateX(-50%)",
                width: paperLayout
                  ? CONTRACT_PAPER_WIDTH * paperLayout.scale
                  : CONTRACT_PAPER_WIDTH * CONTRACT_PAPER_SCALE,
              }}
              className="absolute left-1/2 opacity-0 data-[ready=true]:opacity-100"
              data-ready={paperLayout !== null}
            >
              <div
                style={{ transform: `scale(${paperLayout?.scale ?? CONTRACT_PAPER_SCALE})` }}
                className="origin-top-left"
              >
                <ContractPaper contract={liveContract} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default function ClientContractsPage() {
  const [contractList, setContractList] = React.useState<ClientContract[]>(mockContracts);
  const [selectedContract, setSelectedContract] = React.useState<ClientContract | null>(null);

  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "id", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<ColumnDef<ClientContract>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              aria-label="Select all contracts"
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
            Contract ID
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
        id: "type",
        accessorKey: "type",
        header: "Contract Type",
        cell: ({ row }) => <span className="text-sm">{row.original.type}</span>,
        filterFn: "equalsString",
      },
      {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>Start: {row.original.startDate}</span>
            <span>End: {row.original.endDate}</span>
          </div>
        ),
      },
      {
        id: "progress",
        accessorKey: "progress",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 h-8 text-sm font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Term Elapsed
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress value={row.original.progress} className="h-1.5 w-20" />
            <span className="text-xs font-medium">{row.original.progress}%</span>
          </div>
        ),
      },
      {
        id: "value",
        accessorKey: "value",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 h-8 text-sm font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Value / Billing
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        ),
        cell: ({ row }) => <span className="text-sm font-medium">{row.original.value}</span>,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const style = statusStyles[row.original.status];
          return (
            <Badge className={`gap-1.5 border px-2 py-0.5 font-medium ${style.badge}`} variant="outline">
              {row.original.status === "Expiring" && (
                <AlertTriangle className="size-3 mr-0.5 text-amber-500" />
              )}
              {style.dot && <span className={`size-1.5 rounded-full ${style.dot}`} />}
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
              onClick={() => setSelectedContract(row.original)}
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
    data: contractList,
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
  const typeFilter = (table.getColumn("type")?.getFilterValue() as string) ?? "all";
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

  const handleTypeChange = (val: string) => {
    table.getColumn("type")?.setFilterValue(val === "all" ? undefined : val);
    table.setPageIndex(0);
  };

  const handleStatusChange = (val: string) => {
    table.getColumn("status")?.setFilterValue(val === "all" ? undefined : val);
    table.setPageIndex(0);
  };

  const handleSaveContract = (updatedContract: ClientContract) => {
    setContractList((current) =>
      current.map((c) => (c.id === updatedContract.id ? updatedContract : c))
    );
    setSelectedContract(null);
  };

  if (selectedContract) {
    return (
      <div className="flex flex-col gap-6">
        {/* Back navigation & title header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setSelectedContract(null)}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">{selectedContract.id}</h1>
            <p className="text-muted-foreground text-sm">Contract parameters and signed legal agreement live preview</p>
          </div>
        </div>

        <ContractFormEditor
          contract={selectedContract}
          onSave={handleSaveContract}
          onCancel={() => setSelectedContract(null)}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Client Contracts</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Monitor contract execution, track billing periods, and manage upcoming contract renewals.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder="Search contracts..."
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
            <Plus /> New Contract
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-1">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={typeFilter} onValueChange={handleTypeChange}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground mr-1">Type:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="SLA Support">SLA Support</SelectItem>
                  <SelectItem value="Enterprise Licensing">Enterprise Licensing</SelectItem>
                  <SelectItem value="Retainer (Security)">Retainer</SelectItem>
                  <SelectItem value="Project-Based">Project-Based</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground mr-1">Status:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expiring">Expiring Soon</SelectItem>
                  <SelectItem value="Renewed">Renewed</SelectItem>
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
                    onClick={() => setSelectedContract(row.original)}
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
                    No contracts found matching the criteria.
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
