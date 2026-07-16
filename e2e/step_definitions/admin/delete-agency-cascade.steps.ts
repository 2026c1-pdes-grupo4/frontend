import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

const AGENCY_PASSWORD = 'secret123'

When('esa inmobiliaria publica una propiedad', async function (this: CustomWorld) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const username = this.state.newAgencyUsername as string

  // The previous step clicks submit but doesn't wait for creation to complete
  // before returning — confirm the agency actually exists before logging in as it.
  await expect(this.page.getByText(username, { exact: true })).toBeVisible()

  const loginRes = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: AGENCY_PASSWORD }),
  })
  if (!loginRes.ok) throw new Error(`Agency login failed: HTTP ${loginRes.status}`)
  const { token } = await loginRes.json() as { token: string }

  const suffix = Date.now()
  const address = `Delete Cascade Address ${suffix}`
  this.state.address = address

  const propRes = await fetch(`${apiUrl}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      address, city: 'Buenos Aires', province: 'Buenos Aires', propertyType: 'APARTMENT',
      areaSq: 100, rooms: 3, description: 'x',
      circumscription: `C${suffix}`, section: `S${suffix}`, block: `B${suffix}`, parcel: `P${suffix}`,
    }),
  })
  if (!propRes.ok) throw new Error(`Property creation failed: HTTP ${propRes.status}`)
  const property = await propRes.json() as { id: number }

  const listingRes = await fetch(`${apiUrl}/agency-properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ propertyId: property.id, listedPrice: 100000 }),
  })
  if (!listingRes.ok) throw new Error(`Listing publish failed: HTTP ${listingRes.status}`)
})

When('elimina esa inmobiliaria', async function (this: CustomWorld) {
  const username = this.state.newAgencyUsername as string
  const row = this.page.locator('tr', { hasText: username })
  await row.locator('[data-testid="btn-delete-agency"]').click()
})

Then('la inmobiliaria ya no aparece en la tabla de inmobiliarias', async function (this: CustomWorld) {
  const username = this.state.newAgencyUsername as string
  await expect(this.page.getByText(username, { exact: true })).toHaveCount(0)
})

Then('esa propiedad ya no aparece en los resultados de búsqueda de los compradores', async function (this: CustomWorld) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const loginRes = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'buyer2', password: 'buyer123' }),
  })
  const { token } = await loginRes.json() as { token: string }

  const searchRes = await fetch(`${apiUrl}/properties/search?keyword=${encodeURIComponent(this.state.address as string)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const { content } = await searchRes.json() as { content: unknown[] }
  expect(content.length).toBe(0)
})

Then('la inmobiliaria eliminada ya no puede iniciar sesión', async function (this: CustomWorld) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const username = this.state.newAgencyUsername as string
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: AGENCY_PASSWORD }),
  })
  expect(res.status).toBe(401)
})
