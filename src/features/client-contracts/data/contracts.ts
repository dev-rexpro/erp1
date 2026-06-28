import { faker } from '@faker-js/faker'
import { clientCompanies } from '../../client-invoices/data/invoices'

faker.seed(998877)

export const contracts = Array.from({ length: 120 }, (_, i) => {
  const client = faker.helpers.arrayElement(clientCompanies)
  const contractCode = `CTR-2026-${1000 + i}`
  const rawValue = faker.number.int({ min: 12000, max: 850000 })
  const amountStr = `$${rawValue.toLocaleString('en-US')}.00`
  
  const baseDate = faker.date.recent()
  const validUntil = new Date(baseDate.getTime() + 1000 * 60 * 60 * 24 * 365 * faker.number.int({ min: 1, max: 3 }))
    .toISOString()
    .split('T')[0]

  return {
    id: `ctr-${1000 + i}`,
    firstName: client.name,
    lastName: '',
    username: contractCode,
    email: client.email,
    phoneNumber: client.phone,
    status: faker.helpers.arrayElement([
      'active',    // Active
      'inactive',  // Expired
      'invited',   // Pending Sign
      'suspended', // Terminated
    ]),
    role: faker.helpers.arrayElement([
      'superadmin', // Master Agreement
      'admin',      // SLA
      'manager',    // NDA
      'cashier',    // Ad-Hoc
    ]),
    amount: amountStr,
    validUntil,
    createdAt: baseDate,
    updatedAt: baseDate,
  }
})
