import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

When('navega a la pestaña Reportes', async function (this: CustomWorld) {
  await this.page.click('[data-testid="tab-reports"]')
  await this.page.waitForSelector('[data-testid="reports-section"]')
})

Then('la tabla de top compradores muestra al menos una fila', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="top-buyer-row"]').first()).toBeVisible()
})

Then('cada fila de comprador tiene usuario y cantidad de compras', async function (this: CustomWorld) {
  const rows = this.page.locator('[data-testid="top-buyer-row"]')
  const count = await rows.count()
  for (let i = 0; i < count; i++) {
    const cells = rows.nth(i).locator('td')
    await expect(cells.nth(0)).not.toBeEmpty()
    await expect(cells.nth(1)).not.toBeEmpty()
  }
})

Then('la tabla de propiedades mejor puntuadas muestra al menos una fila', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="top-property-row"]').first()).toBeVisible()
})

Then('cada fila de propiedad tiene dirección y puntaje promedio', async function (this: CustomWorld) {
  const rows = this.page.locator('[data-testid="top-property-row"]')
  const count = await rows.count()
  for (let i = 0; i < count; i++) {
    const cells = rows.nth(i).locator('td')
    await expect(cells.nth(0)).not.toBeEmpty()
    await expect(cells.nth(1)).not.toBeEmpty()
  }
})

Then('la tabla de top inmobiliarias muestra al menos una fila', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="top-agency-row"]').first()).toBeVisible()
})

Then('cada fila de inmobiliaria tiene nombre y cantidad de ventas', async function (this: CustomWorld) {
  const rows = this.page.locator('[data-testid="top-agency-row"]')
  const count = await rows.count()
  for (let i = 0; i < count; i++) {
    const cells = rows.nth(i).locator('td')
    await expect(cells.nth(0)).not.toBeEmpty()
    await expect(cells.nth(1)).not.toBeEmpty()
  }
})
