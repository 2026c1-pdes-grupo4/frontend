import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

When('navega a la página de mis compras', async function (this: CustomWorld) {
  await this.page.goto(`${this.baseUrl}/purchases`)
  await this.page.waitForSelector('[data-testid="purchases-page"], .purchases-empty')
})

Then('ve la tabla de compras', async function (this: CustomWorld) {
  // Either a table or an empty state is acceptable
  const table = this.page.locator('[data-testid="purchases-table"]')
  const empty = this.page.locator('.purchases-empty')
  const tableVisible = await table.isVisible().catch(() => false)
  const emptyVisible = await empty.isVisible().catch(() => false)
  expect(tableVisible || emptyVisible).toBe(true)
})

Then('la tabla de compras muestra al menos una fila', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="purchase-row"]').first()).toBeVisible()
})

Then('cada fila de compra tiene propiedad y precio visibles', async function (this: CustomWorld) {
  const rows = this.page.locator('[data-testid="purchase-row"]')
  const count = await rows.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    const row = rows.nth(i)
    const cells = row.locator('td')
    await expect(cells.nth(1)).not.toBeEmpty() // property address
    await expect(cells.nth(3)).not.toBeEmpty() // price
  }
})
