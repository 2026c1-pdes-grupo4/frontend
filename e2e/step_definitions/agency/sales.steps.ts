import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

When('navega a la pestaña Ventas', async function (this: CustomWorld) {
  await this.page.click('[data-testid="tab-sales"]')
  await this.page.waitForSelector('[data-testid="sales-list"]')
})

Then('la tabla de ventas muestra al menos una fila', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="sale-row"]').first()).toBeVisible()
})

Then('cada fila de venta tiene precio y fecha visibles', async function (this: CustomWorld) {
  const rows = this.page.locator('[data-testid="sale-row"]')
  const count = await rows.count()
  for (let i = 0; i < count; i++) {
    const row = rows.nth(i)
    await expect(row).toContainText('USD')
    await expect(row.locator('td').nth(4)).not.toBeEmpty()
  }
})
