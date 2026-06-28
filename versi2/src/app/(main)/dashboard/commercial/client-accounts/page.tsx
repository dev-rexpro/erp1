"use client";

import * as React from "react";
import { useForm, FormProvider, useWatch, Controller } from "react-hook-form";
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
  CheckCircle2,
  Clock,
  Cog,
  Download,
  Grid,
  MoreHorizontal,
  Plus,
  Rows3,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type ClientAccount = {
  id: string;
  name: string;
  domain: string;
  industry: string;
  status: "Active" | "Onboarding" | "Inactive";
  value: number;
  contacts: number;
  manager: string;
};

const mockAccounts: ClientAccount[] = [
  {
    id: "1",
    name: "Acme Corporation",
    domain: "acme.com",
    industry: "Technology",
    status: "Active",
    value: 450000,
    contacts: 12,
    manager: "Sarah Jenkins",
  },
  {
    id: "2",
    name: "Stark Industries",
    domain: "stark.com",
    industry: "Manufacturing",
    status: "Active",
    value: 1200000,
    contacts: 24,
    manager: "Tony Stark",
  },
  {
    id: "3",
    name: "Wayne Enterprises",
    domain: "wayne.com",
    industry: "Finance",
    status: "Active",
    value: 850000,
    contacts: 18,
    manager: "Bruce Wayne",
  },
  {
    id: "4",
    name: "Oscorp Technologies",
    domain: "oscorp.com",
    industry: "BioTech",
    status: "Onboarding",
    value: 320000,
    contacts: 6,
    manager: "Norman Osborn",
  },
  {
    id: "5",
    name: "Umbrella Corp",
    domain: "umbrella.com",
    industry: "Healthcare",
    status: "Inactive",
    value: 150000,
    contacts: 3,
    manager: "Albert Wesker",
  },
  {
    id: "6",
    name: "Cyberdyne Systems",
    domain: "cyberdyne.com",
    industry: "Technology",
    status: "Inactive",
    value: 95000,
    contacts: 2,
    manager: "Miles Dyson",
  },
  {
    id: "7",
    name: "LexCorp",
    domain: "lexcorp.com",
    industry: "Defense",
    status: "Active",
    value: 1400000,
    contacts: 30,
    manager: "Lex Luthor",
  },
];

const statusStyles: Record<ClientAccount["status"], { badge: string; dot: string }> = {
  Active: {
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Onboarding: {
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Inactive: {
    badge: "border-border bg-muted/50 text-muted-foreground",
    dot: "bg-muted-foreground",
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

// Client Account Form Editor layout (No print preview as per spec)
function AccountFormEditor({ account, onSave, onCancel }: { account: ClientAccount; onSave: (data: ClientAccount) => void; onCancel: () => void }) {
  const methods = useForm<ClientAccount>({
    defaultValues: account,
  });

  const { control, register, handleSubmit } = methods;

  // Watch fields dynamically to feed into live preview
  const liveFormState = useWatch({ control });
  const liveAccount = { ...account, ...liveFormState } as ClientAccount;

  const onSubmit = (data: ClientAccount) => {
    onSave(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/* Main Form Fields Container (styled exactly like invoice-form) */}
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
          <div className="flex flex-col gap-1 pb-2">
            <h2 className="font-semibold text-lg leading-none tracking-tight">Account Detail</h2>
            <p className="text-muted-foreground text-xs">Update general client account metrics and manager assignments.</p>
          </div>

          <Separator />

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="address">Address & Contact</TabsTrigger>
              <TabsTrigger value="tax">Tax</TabsTrigger>
              <TabsTrigger value="accounting">Accounting</TabsTrigger>
              <TabsTrigger value="sales">Sales Team</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="portal">Portal Users</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-0">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field className="col-span-2 gap-1">
                    <FieldLabel className="text-xs" htmlFor="company-name">Company Name</FieldLabel>
                    <Input id="company-name" {...register("name")} placeholder="Company Name" />
                  </Field>

                  <Field className="col-span-2 gap-1">
                    <FieldLabel className="text-xs" htmlFor="domain">Domain</FieldLabel>
                    <Input id="domain" {...register("domain")} placeholder="company.com" />
                  </Field>

                  <Field className="gap-1">
                    <FieldLabel className="text-xs">Industry</FieldLabel>
                    <Controller
                      control={control}
                      name="industry"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="BioTech">BioTech</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Defense">Defense</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
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
                            <SelectItem value="Onboarding">Onboarding</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>

                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="portfolio-value">Portfolio Value ($)</FieldLabel>
                    <Input id="portfolio-value" type="number" {...register("value", { valueAsNumber: true })} />
                  </Field>

                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="contacts-count">Contacts Count</FieldLabel>
                    <Input id="contacts-count" type="number" {...register("contacts", { valueAsNumber: true })} />
                  </Field>

                  <Field className="col-span-2 gap-1">
                    <FieldLabel className="text-xs">Account Manager</FieldLabel>
                    <Controller
                      control={control}
                      name="manager"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sarah Jenkins">Sarah Jenkins</SelectItem>
                            <SelectItem value="Tony Stark">Tony Stark</SelectItem>
                            <SelectItem value="Bruce Wayne">Bruce Wayne</SelectItem>
                            <SelectItem value="Norman Osborn">Norman Osborn</SelectItem>
                            <SelectItem value="Albert Wesker">Albert Wesker</SelectItem>
                            <SelectItem value="Miles Dyson">Miles Dyson</SelectItem>
                            <SelectItem value="Lex Luthor">Lex Luthor</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="address" className="space-y-4 mt-0">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field className="col-span-2 gap-1">
                    <FieldLabel className="text-xs" htmlFor="billing-address">Billing Address</FieldLabel>
                    <Textarea id="billing-address" rows={3} placeholder="123 Corporate Blvd, Suite 100" />
                  </Field>
                  <Field className="col-span-2 gap-1">
                    <FieldLabel className="text-xs" htmlFor="shipping-address">Shipping Address</FieldLabel>
                    <Textarea id="shipping-address" rows={3} placeholder="Same as billing address" />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="contact-email">Primary Contact Email</FieldLabel>
                    <Input id="contact-email" placeholder="contact@company.com" />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="contact-phone">Primary Contact Phone</FieldLabel>
                    <Input id="contact-phone" placeholder="+1 (555) 000-0000" />
                  </Field>
                </div>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="tax" className="space-y-4 mt-0">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="tax-id">Tax ID / VAT Number</FieldLabel>
                    <Input id="tax-id" placeholder="TX-XX-XXXX" />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="tax-rate">Applicable Tax Rate (%)</FieldLabel>
                    <Input id="tax-rate" type="number" placeholder="10" />
                  </Field>
                </div>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="accounting" className="space-y-4 mt-0">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="bank-account">Bank Account Number</FieldLabel>
                    <Input id="bank-account" placeholder="XXXX-XXXX-XXXX" />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="bank-name">Bank Name</FieldLabel>
                    <Input id="bank-name" placeholder="Chase Bank" />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel className="text-xs">Billing Currency</FieldLabel>
                    <Select defaultValue="USD">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4 mt-0">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field className="gap-1">
                    <FieldLabel className="text-xs">Lead Source</FieldLabel>
                    <Select defaultValue="website">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website / Direct</SelectItem>
                        <SelectItem value="referral">Client Referral</SelectItem>
                        <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                        <SelectItem value="partner">Partner Channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="sales-rep">Sales Representative</FieldLabel>
                    <Input id="sales-rep" placeholder="Representative Name" />
                  </Field>
                </div>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-0">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field className="gap-1">
                    <FieldLabel className="text-xs">Payment Terms</FieldLabel>
                    <Select defaultValue="net30">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Due Upon Receipt</SelectItem>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="col-span-2 gap-1 flex flex-row items-center justify-between border rounded-lg p-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold">Allow Portal Access</span>
                      <span className="text-xs text-muted-foreground">Grant permission to client representatives to view shared documents and portals.</span>
                    </div>
                    <Checkbox id="allow-portal" />
                  </Field>
                </div>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="portal" className="space-y-4 mt-0">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field className="gap-1">
                    <FieldLabel className="text-xs" htmlFor="portal-username">Portal Username</FieldLabel>
                    <Input id="portal-username" placeholder="client_user" />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel className="text-xs">Portal Role</FieldLabel>
                    <Select defaultValue="viewer">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Account Admin</SelectItem>
                        <SelectItem value="billing">Billing Manager</SelectItem>
                        <SelectItem value="viewer">Standard Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Account
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default function ClientAccountsPage() {
  const [accountList, setAccountList] = React.useState<ClientAccount[]>(mockAccounts);
  const [selectedAccount, setSelectedAccount] = React.useState<ClientAccount | null>(null);

  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "name", desc: false }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<ColumnDef<ClientAccount>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              aria-label="Select all accounts"
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              aria-label={`Select ${row.original.name}`}
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 h-8 text-sm font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company Name
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{row.original.name}</span>
            <span className="text-muted-foreground text-xs">{row.original.domain}</span>
          </div>
        ),
        filterFn: "includesString",
      },
      {
        id: "industry",
        accessorKey: "industry",
        header: "Industry",
        cell: ({ row }) => <span className="text-sm">{row.original.industry}</span>,
        filterFn: "equalsString",
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
        id: "value",
        accessorKey: "value",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3 h-8 text-sm font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Portfolio Value
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        ),
        cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.value)}</span>,
      },
      {
        id: "contacts",
        accessorKey: "contacts",
        header: "Contacts",
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.contacts} people</span>,
      },
      {
        id: "manager",
        accessorKey: "manager",
        header: "Account Manager",
        cell: ({ row }) => <span className="text-sm">{row.original.manager}</span>,
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
              onClick={() => setSelectedAccount(row.original)}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: accountList,
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

  const searchQuery = (table.getColumn("name")?.getFilterValue() as string) ?? "";
  const industryFilter = (table.getColumn("industry")?.getFilterValue() as string) ?? "all";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "all";
  const managerFilter = (table.getColumn("manager")?.getFilterValue() as string) ?? "all";

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = Math.min(table.getState().pagination.pageIndex + 1, pageCount);
  const pageNumbers = getPageNumbers(currentPage, pageCount);
  const rowsPerPage = `${table.getState().pagination.pageSize}`;

  const handleSearch = (val: string) => {
    table.getColumn("name")?.setFilterValue(val || undefined);
    table.setPageIndex(0);
  };

  const handleIndustryChange = (val: string) => {
    table.getColumn("industry")?.setFilterValue(val === "all" ? undefined : val);
    table.setPageIndex(0);
  };

  const handleStatusChange = (val: string) => {
    table.getColumn("status")?.setFilterValue(val === "all" ? undefined : val);
    table.setPageIndex(0);
  };

  const handleManagerChange = (val: string) => {
    table.getColumn("manager")?.setFilterValue(val === "all" ? undefined : val);
    table.setPageIndex(0);
  };

  const handleSaveAccount = (updatedAccount: ClientAccount) => {
    setAccountList((current) =>
      current.map((a) => (a.id === updatedAccount.id ? updatedAccount : a))
    );
    setSelectedAccount(null);
  };

  if (selectedAccount) {
    return (
      <div className="flex flex-col gap-6">
        {/* Back navigation & title header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setSelectedAccount(null)}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">{selectedAccount.name}</h1>
            <p className="text-muted-foreground text-sm">Account details editor and management summary</p>
          </div>
        </div>

        <AccountFormEditor
          account={selectedAccount}
          onSave={handleSaveAccount}
          onCancel={() => setSelectedAccount(null)}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Client Accounts</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Manage your client accounts, active customers, and account manager assignments.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder="Search accounts..."
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
            <Plus /> Add Account
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-1">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={industryFilter} onValueChange={handleIndustryChange}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground mr-1">Industry:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="BioTech">BioTech</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Defense">Defense</SelectItem>
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
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Select value={managerFilter} onValueChange={handleManagerChange}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground mr-1">Manager:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Sarah Jenkins">Sarah Jenkins</SelectItem>
                <SelectItem value="Tony Stark">Tony Stark</SelectItem>
                <SelectItem value="Bruce Wayne">Bruce Wayne</SelectItem>
                <SelectItem value="Norman Osborn">Norman Osborn</SelectItem>
                <SelectItem value="Albert Wesker">Albert Wesker</SelectItem>
                <SelectItem value="Miles Dyson">Miles Dyson</SelectItem>
                <SelectItem value="Lex Luthor">Lex Luthor</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
                    onClick={() => setSelectedAccount(row.original)}
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
                    No client accounts found matching the criteria.
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
