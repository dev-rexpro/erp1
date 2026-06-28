import { faker } from '@faker-js/faker'

faker.seed(334455)

export const clientCompanies = [
  {
    name: 'Bright Enterprises',
    email: 'billing@brightenterprises.com',
    addressLines: ['450 Park Avenue South', 'New York, NY 10016', 'United States'],
    taxId: 'US-EIN-84-2938475',
    phone: '+1-512-555-0184'
  },
  {
    name: 'Northline GmbH',
    email: 'ap@northline.de',
    addressLines: ['Kastanienallee 32', '10435 Berlin', 'Germany'],
    taxId: 'DE-VAT-219384756',
    phone: '+49-30-555-0192'
  },
  {
    name: 'Omniverse One Ltd',
    email: 'finance@omniverseone.co.uk',
    addressLines: ['88 Kingsway', 'London, WC2B 6SR', 'United Kingdom'],
    taxId: 'UK-VAT-902312019',
    phone: '+44-20-7946-0958'
  },
  {
    name: 'Rexcorp Global Trade',
    email: 'finance@rexcorp.id',
    addressLines: ['Rexcorp Tower Fl 24', 'Sudirman Kav 21, Jakarta', 'Indonesia'],
    taxId: 'ID-TAX-01.223.445',
    phone: '+62-21-555-0177'
  }
]

export const invoices = Array.from({ length: 100 }, (_, i) => {
  const client = faker.helpers.arrayElement(clientCompanies)
  const invoiceNumber = `INV-2026-${1000 + i}`
  const rawAmount = faker.number.int({ min: 500, max: 45000 })
  const amountStr = `$${rawAmount.toLocaleString('en-US')}.00`
  
  const baseDate = faker.date.recent()
  const dueDate = new Date(baseDate.getTime() + 1000 * 60 * 60 * 24 * 30)
    .toISOString()
    .split('T')[0]

  return {
    id: `inv-${1000 + i}`,
    firstName: client.name,
    lastName: '',
    username: invoiceNumber,
    email: client.email,
    phoneNumber: client.phone,
    status: faker.helpers.arrayElement([
      'active',    // Paid
      'inactive',  // Overdue
      'invited',   // Draft
      'suspended', // Canceled
    ]),
    role: faker.helpers.arrayElement([
      'superadmin', // Commercial
      'admin',      // Proforma
      'manager',    // Tax Invoice
      'cashier',    // Credit Note
    ]),
    amount: amountStr,
    dueDate,
    createdAt: baseDate,
    updatedAt: baseDate,
  }
})
