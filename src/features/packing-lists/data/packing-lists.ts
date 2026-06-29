import { faker } from '@faker-js/faker'
import { clientCompanies } from '../../client-invoices/data/invoices'

faker.seed(778899)

export const packingLists = Array.from({ length: 150 }, (_, i) => {
  const client = faker.helpers.arrayElement(clientCompanies)
  const packingListNumber = `PL-2026-${1000 + i}`
  
  const count = faker.number.int({ min: 5, max: 120 })
  const formatType = faker.helpers.arrayElement([
    { key: 'superadmin', label: 'Cartons' },
    { key: 'admin', label: 'Pallets' },
    { key: 'manager', label: 'Wooden Crates' },
    { key: 'cashier', label: 'Containers' },
  ])

  const amountStr = `${count} ${formatType.label}`
  
  const baseDate = faker.date.recent()
  const validUntil = new Date(baseDate.getTime() + 1000 * 60 * 60 * 24 * faker.number.int({ min: 1, max: 10 }))
    .toISOString()
    .split('T')[0]

  return {
    id: `pl-${1000 + i}`,
    firstName: client.name,
    lastName: '',
    username: packingListNumber,
    email: client.email,
    phoneNumber: client.phone,
    status: faker.helpers.arrayElement([
      'active',    // Approved
      'inactive',  // Received
      'invited',   // Draft
      'suspended', // Shipped
    ]),
    role: formatType.key as 'superadmin' | 'admin' | 'manager' | 'cashier',
    amount: amountStr,
    validUntil, // Packing / Ship Date
    createdAt: baseDate,
    updatedAt: baseDate,
  }
})
