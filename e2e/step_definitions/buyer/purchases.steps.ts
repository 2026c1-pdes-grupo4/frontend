import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

Given('que ya compró una propiedad disponible', async function (this: CustomWorld) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const token = this.state.token as string

  const searchRes = await fetch(`${apiUrl}/properties/search`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const paged = await searchRes.json() as { content: { address: string; available: boolean; id: number }[] }
  const properties = paged.content
  const target = properties.find((p) => p.available)
  if (!target) throw new Error('No available property found to purchase')

  const purchaseRes = await fetch(`${apiUrl}/purchases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ agencyPropertyId: target.id }),
  })
  if (!purchaseRes.ok) throw new Error(`Purchase setup failed: HTTP ${purchaseRes.status}`)

  this.state.purchasedAddress = target.address
})

When('navega a la página de propiedades', async function (this: CustomWorld) {
  await this.page.goto(`${this.baseUrl}/properties`)
  await this.page.waitForSelector('[data-testid="properties-page"]')
})

When('hace clic en "Comprar" en la primera propiedad disponible', async function (this: CustomWorld) {
  await this.page.locator('[data-testid="btn-buy-property"]').first().click()
  await this.page.waitForSelector('[data-testid="buy-confirm-dialog"]')
})

When('confirma la compra', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-confirm-purchase"]')
})

Then('ve el mensaje de confirmación de compra', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="purchase-success-message"]')).toBeVisible()
})

Then('esa propiedad ya no aparece en la lista', async function (this: CustomWorld) {
  const address = this.state.purchasedAddress as string
  await expect(this.page.locator('.property-card__address', { hasText: address })).toHaveCount(0)
})
