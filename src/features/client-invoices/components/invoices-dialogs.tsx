import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useInvoices } from './invoices-provider'
import { invoices as staticInvoices } from '../data/invoices'
import { toast } from 'sonner'

export function InvoicesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useInvoices()
  
  // Form states
  const [clientName, setClientName] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive' | 'invited' | 'suspended'>('invited')
  const [type, setType] = useState<'superadmin' | 'admin' | 'manager' | 'cashier'>('superadmin')

  useEffect(() => {
    if (currentRow) {
      setClientName(currentRow.firstName)
      setInvoiceNumber(currentRow.username)
      setAmount(currentRow.amount)
      setStatus(currentRow.status)
      setType(currentRow.role)
    } else {
      setClientName('')
      setInvoiceNumber(`INV-2026-${1000 + staticInvoices.length}`)
      setAmount('$1,500.00')
      setStatus('invited')
      setType('superadmin')
    }
  }, [currentRow, open])

  const handleSave = () => {
    if (open === 'add') {
      const newInvoice = {
        id: Math.random().toString(),
        firstName: clientName,
        lastName: '',
        username: invoiceNumber,
        email: `billing@${clientName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`,
        phoneNumber: '+62 812-3456-7890',
        status,
        role: type,
        amount,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      staticInvoices.unshift(newInvoice)
      toast.success(`Invoice ${invoiceNumber} created successfully!`)
    } else if (open === 'edit' && currentRow) {
      const index = staticInvoices.findIndex((inv) => inv.id === currentRow.id)
      if (index !== -1) {
        staticInvoices[index] = {
          ...staticInvoices[index],
          firstName: clientName,
          username: invoiceNumber,
          amount,
          status,
          role: type,
        }
        toast.success(`Invoice ${invoiceNumber} updated successfully!`)
      }
    }
    setOpen(null)
    setCurrentRow(null)
  }

  const handleDelete = () => {
    if (currentRow) {
      const index = staticInvoices.findIndex((inv) => inv.id === currentRow.id)
      if (index !== -1) {
        staticInvoices.splice(index, 1)
        toast.success(`Invoice ${currentRow.username} deleted successfully!`)
      }
    }
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <>
      {/* Add / Edit Dialog */}
      <Dialog open={open === 'add' || open === 'edit'} onOpenChange={(v) => { if (!v) { setOpen(null); setCurrentRow(null); } }}>
        <DialogContent className='sm:max-w-[425px] rounded-2xl'>
          <DialogHeader>
            <DialogTitle>{open === 'add' ? 'Add Client Invoice' : 'Edit Invoice Details'}</DialogTitle>
            <DialogDescription>
              Provide the details of the invoice below. Click save when you are finished.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='client-name' className='text-right'>Client</Label>
              <Input id='client-name' value={clientName} onChange={(e) => setClientName(e.target.value)} className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='invoice-number' className='text-right'>Invoice #</Label>
              <Input id='invoice-number' value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='amount' className='text-right'>Total Amount</Label>
              <Input id='amount' value={amount} onChange={(e) => setAmount(e.target.value)} className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>Status</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                  <SelectItem value='active'>Paid</SelectItem>
                  <SelectItem value='invited'>Draft</SelectItem>
                  <SelectItem value='inactive'>Overdue</SelectItem>
                  <SelectItem value='suspended'>Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='type' className='text-right'>Invoice Type</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                  <SelectItem value='superadmin'>Commercial Invoice</SelectItem>
                  <SelectItem value='admin'>Proforma Invoice</SelectItem>
                  <SelectItem value='manager'>Tax Invoice</SelectItem>
                  <SelectItem value='cashier'>Credit Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => { setOpen(null); setCurrentRow(null); }}>Cancel</Button>
            <Button onClick={handleSave} className='bg-black hover:bg-black/90 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black'>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={open === 'delete'} onOpenChange={(v) => { if (!v) { setOpen(null); setCurrentRow(null); } }}>
        <DialogContent className='sm:max-w-[425px] rounded-2xl'>
          <DialogHeader>
            <DialogTitle className='text-red-600'>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete invoice {currentRow?.username}? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button variant='outline' onClick={() => { setOpen(null); setCurrentRow(null); }}>Cancel</Button>
            <Button variant='destructive' onClick={handleDelete}>Delete Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
