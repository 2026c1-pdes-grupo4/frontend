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

Then('al confirmar, la propiedad aparece en su lista con precio {string}', { timeout: 10000 }, async function (this: CustomWorld, price: string) {
  await this.page.click('[data-testid="btn-confirm-list-existing"]')
  await this.page.waitForSelector('[data-testid="duplicate-confirm-dialog"]', { state: 'detached' })
  const list = this.page.locator('[data-testid="property-list"]')
  await expect(list).toContainText(this.state.address as string)
  await expect(list).toContainText(Number(price).toLocaleString())
})
