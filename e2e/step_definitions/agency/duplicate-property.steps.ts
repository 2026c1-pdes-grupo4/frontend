import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

type Cadastral = { circumscription: string; section: string; block: string; parcel: string }

async function loginAsAgency(world: CustomWorld, username: string) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: 'agency123' }),
  })
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`)
  const { token } = await res.json() as { token: string }

  await world.page.goto(world.baseUrl)
  await world.page.evaluate((t: string) => localStorage.setItem('token', t), token)
  await world.page.goto(`${world.baseUrl}/agency`)
  await world.page.waitForSelector('[data-testid="agency-tabs"]')
}

async function fillPropertyForm(world: CustomWorld, address: string, price: string, cadastral: Cadastral) {
  await world.page.click('[data-testid="tab-properties"]')
  await world.page.click('[data-testid="btn-new-property"]')
  await world.page.waitForSelector('[data-testid="property-form"]')
  await world.page.fill('[data-testid="input-address"]', address)
  await world.page.fill('[data-testid="input-city"]', 'Buenos Aires')
  await world.page.fill('[data-testid="input-province"]', 'Buenos Aires')
  await world.page.fill('[data-testid="input-price"]', price)
  await world.page.fill('[data-testid="input-areaSq"]', '100')
  await world.page.fill('[data-testid="input-rooms"]', '3')
  await world.page.fill('[data-testid="input-circumscription"]', cadastral.circumscription)
  await world.page.fill('[data-testid="input-section"]', cadastral.section)
  await world.page.fill('[data-testid="input-block"]', cadastral.block)
  await world.page.fill('[data-testid="input-parcel"]', cadastral.parcel)
  await world.page.click('[data-testid="btn-submit-property"]')
}

Given('que la inmobiliaria {string} está autenticada', async function (this: CustomWorld, username: string) {
  await loginAsAgency(this, username)
})

When('la inmobiliaria {string} se autentica', async function (this: CustomWorld, username: string) {
  await loginAsAgency(this, username)
})

When('publica una propiedad nueva con precio {string}', { timeout: 20000 }, async function (this: CustomWorld, price: string) {
  const suffix = Date.now()
  const cadastral: Cadastral = {
    circumscription: `C${suffix}`,
    section: `S${suffix}`,
    block: `B${suffix}`,
    parcel: `P${suffix}`,
  }
  const address = `E2E Address ${suffix}`
  this.state.cadastral = cadastral
  this.state.address = address

  await fillPropertyForm(this, address, price, cadastral)
  await this.page.waitForSelector('[data-testid="btn-new-property"]')
})

When('completa el formulario de nueva propiedad con los mismos datos catastrales y precio {string}', { timeout: 20000 }, async function (this: CustomWorld, price: string) {
  const cadastral = this.state.cadastral as Cadastral
  await fillPropertyForm(this, 'Otra direccion cualquiera', price, cadastral)
})

Then('se le pide confirmar que ya existe esa propiedad', async function (this: CustomWorld) {
  const dialog = this.page.locator('[data-testid="duplicate-confirm-dialog"]')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText(this.state.address as string)
})

// New listings are appended at the end of the agency's list, so with enough
// accumulated test data they can land past whatever page size is selected —
// page through until found instead of assuming a fixed size covers everything.
async function findAcrossPages(world: CustomWorld, text: string): Promise<boolean> {
  await world.page.selectOption('.pagination select', '20')
  const list = world.page.locator('[data-testid="property-list"]')
  const nextBtn = world.page.locator('[data-testid="btn-next-page"]')
  const indicator = world.page.locator('[data-testid="page-indicator"]')
  for (;;) {
    if ((await list.textContent())?.includes(text)) return true
    if (await nextBtn.isDisabled()) return false
    // click() only waits for the DOM event to fire, not for React to actually re-render the new page
    const currentPage = await indicator.textContent()
    await nextBtn.click()
    await expect(indicator).not.toHaveText(currentPage ?? '')
  }
}

Then('al confirmar, la propiedad aparece en su lista con precio {string}', { timeout: 10000 }, async function (this: CustomWorld, price: string) {
  await this.page.click('[data-testid="btn-confirm-list-existing"]')
  await this.page.waitForSelector('[data-testid="duplicate-confirm-dialog"]', { state: 'detached' })
  const found = await findAcrossPages(this, this.state.address as string)
  expect(found).toBe(true)
  const list = this.page.locator('[data-testid="property-list"]')
  await expect(list).toContainText(Number(price).toLocaleString())
})

async function loginAsBuyer(username: string): Promise<string> {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: 'buyer123' }),
  })
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`)
  const { token } = await res.json() as { token: string }
  return token
}

When('el comprador {string} compra la propiedad publicada por {string}', async function (this: CustomWorld, buyerUsername: string, agencyUsername: string) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const token = await loginAsBuyer(buyerUsername)

  const searchRes = await fetch(`${apiUrl}/properties/search?keyword=${encodeURIComponent(this.state.address as string)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const { content: listings } = await searchRes.json() as { content: { id: number; address: string; agencyName: string }[] }
  const target = listings.find((l) => l.address === this.state.address && l.agencyName === agencyUsername)
  if (!target) throw new Error(`No listing found for address "${this.state.address as string}" by agency "${agencyUsername}"`)

  const purchaseRes = await fetch(`${apiUrl}/purchases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ agencyPropertyId: target.id }),
  })
  if (!purchaseRes.ok) throw new Error(`Purchase failed: HTTP ${purchaseRes.status}`)
})

Then('esa propiedad ya no aparece en los resultados de búsqueda para el comprador {string}', async function (this: CustomWorld, buyerUsername: string) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const token = await loginAsBuyer(buyerUsername)

  const searchRes = await fetch(`${apiUrl}/properties/search?keyword=${encodeURIComponent(this.state.address as string)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const { content: listings } = await searchRes.json() as { content: { address: string }[] }
  const stillListed = listings.some((l) => l.address === this.state.address)
  expect(stillListed).toBe(false)
})

Then('la inmobiliaria {string} todavía la ve en su lista de publicaciones', async function (this: CustomWorld, agencyUsername: string) {
  await loginAsAgency(this, agencyUsername)
  await this.page.click('[data-testid="tab-properties"]')
  const found = await findAcrossPages(this, this.state.address as string)
  expect(found).toBe(true)
})
