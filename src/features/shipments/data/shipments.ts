import { faker } from '@faker-js/faker'
import { clientCompanies } from '../../client-invoices/data/invoices'

faker.seed(445566)

export const shipments = Array.from({ length: 150 }, (_, i) => {
  const client = faker.helpers.arrayElement(clientCompanies)
  const shipmentNumber = `SH-2026-${1000 + i}`
  const rawAmount = faker.number.int({ min: 800, max: 35000 })
  const amountStr = `$${rawAmount.toLocaleString('en-US')}.00`
  
  const baseDate = faker.date.recent()
  const validUntil = new Date(baseDate.getTime() + 1000 * 60 * 60 * 24 * faker.number.int({ min: 2, max: 14 }))
    .toISOString()
    .split('T')[0]

  return {
    id: `sh-${1000 + i}`,
    firstName: client.name,
    lastName: '',
    username: shipmentNumber,
    email: client.email,
    phoneNumber: client.phone,
    status: faker.helpers.arrayElement([
      'active',    // In Transit
      'inactive',  // Delivered
      'invited',   // Scheduled
      'suspended', // Delayed
    ]),
    role: faker.helpers.arrayElement([
      'superadmin', // Air Freight
      'admin',      // Ocean Freight
      'manager',    // Land Transport
      'cashier',    // Rail Freight
    ]),
    amount: amountStr,
    validUntil, // Delivery ETA Date
    createdAt: baseDate,
    updatedAt: baseDate,
  }
})
