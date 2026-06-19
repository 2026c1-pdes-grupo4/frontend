import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

When('navega a la pestaña Usuarios', async function (this: CustomWorld) {
  await this.page.click('[data-testid="tab-users"]')
  await this.page.waitForSelector('[data-testid="users-table"]')
})

Then('ve como máximo {int} filas en la tabla', async function (this: CustomWorld, max: number) {
  const rows = this.page.locator('[data-testid="user-row"]')
  const count = await rows.count()
  expect(count).toBeLessThanOrEqual(max)
})

When('hace clic en siguiente página', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-next-page"]')
})

Then('ve usuarios de la segunda página', async function (this: CustomWorld) {
  const indicator = this.page.locator('[data-testid="page-indicator"]')
  await expect(indicator).toContainText('2')
})

Then('el botón de página anterior está deshabilitado', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="btn-prev-page"]')).toBeDisabled()
})

Then('el botón de página siguiente está deshabilitado', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="btn-next-page"]')).toBeDisabled()
})
