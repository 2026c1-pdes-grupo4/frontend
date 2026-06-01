import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

When('navega a la pestaña Clientes', async function (this: CustomWorld) {
  await this.page.click('[data-testid="tab-clients"]')
  await this.page.waitForSelector('[data-testid="clients-list"]')
})

Then('la tabla de clientes muestra al menos una fila', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="client-row"]').first()).toBeVisible()
})

Then('cada fila de cliente tiene usuario y email visibles', async function (this: CustomWorld) {
  const rows = this.page.locator('[data-testid="client-row"]')
  const count = await rows.count()
  for (let i = 0; i < count; i++) {
    const row = rows.nth(i)
    await expect(row.locator('td').nth(1)).not.toBeEmpty()
    await expect(row.locator('td').nth(2)).toContainText('@')
  }
})
