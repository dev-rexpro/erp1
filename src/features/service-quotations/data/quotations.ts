import { faker } from '@faker-js/faker'
import { clientCompanies } from '../../client-invoices/data/invoices'

faker.seed(112233)

export const quotations = Array.from({ length: 150 }, (_, i) => {
  const client = faker.helpers.arrayElement(clientCompanies)
  const quotationNumber = `QT-2026-${1000 + i}`
  const rawAmount = faker.number.int({ min: 1500, max: 95000 })
  const amountStr = `$${rawAmount.toLocaleString('en-US')}.00`
  
  const baseDate = faker.date.recent()
  const validUntil = new Date(baseDate.getTime() + 1000 * 60 * 60 * 24 * 30)
    .toISOString()
    .split('T')[0]

  return {
    id: `qt-${1000 + i}`,
    firstName: client.name,
    lastName: '',
    username: quotationNumber,
    email: client.email,
    phoneNumber: client.phone,
    status: faker.helpers.arrayElement([
      'active',    // Accepted
      'inactive',  // Expired
      'invited',   // Draft
      'suspended', // Rejected
    ]),
    role: faker.helpers.arrayElement([
      'superadmin', // Air Freight
      'admin',      // Ocean Freight
      'manager',    // Customs Clearance
      'cashier',    // Warehousing
    ]),
    amount: amountStr,
    validUntil,
    createdAt: baseDate,
    updatedAt: baseDate,
  }
})
