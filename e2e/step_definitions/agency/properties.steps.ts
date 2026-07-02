import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

When('navega a la pestaña Propiedades', async function (this: CustomWorld) {
  await this.page.click('[data-testid="tab-properties"]')
  await this.page.waitForSelector('[data-testid="property-list"]')
})

Then('la lista muestra al menos una propiedad', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="property-card"]').first()).toBeVisible()
})

When('hace clic en "Nueva propiedad"', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-new-property"]')
  await this.page.waitForSelector('[data-testid="property-form"]')
})

When('completa el formulario con dirección {string} y precio {string}', async function (this: CustomWorld, address: string, price: string) {
  await this.page.fill('[data-testid="input-address"]', address)
  await this.page.fill('[data-testid="input-city"]', 'Buenos Aires')
  await this.page.fill('[data-testid="input-province"]', 'Buenos Aires')
  await this.page.fill('[data-testid="input-price"]', price)
  await this.page.fill('[data-testid="input-areaSq"]', '100')
  await this.page.fill('[data-testid="input-rooms"]', '3')
})

When('envía el formulario', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-submit-property"]')
  await this.page.waitForSelector('[data-testid="btn-new-property"]')
})

Then('la propiedad con dirección {string} aparece en la lista', async function (this: CustomWorld, address: string) {
  await expect(this.page.locator('[data-testid="property-list"]')).toContainText(address)
})

When('hace clic en editar la primera propiedad', async function (this: CustomWorld) {
  await this.page.locator('[data-testid="btn-edit-property"]').first().click()
  await this.page.waitForSelector('[data-testid="property-form"]')
})

When('cambia el precio a {string}', async function (this: CustomWorld, price: string) {
  await this.page.fill('[data-testid="input-price"]', price)
})

Then('la primera propiedad muestra el precio {string}', async function (this: CustomWorld, price: string) {
  await expect(this.page.locator('[data-testid="property-card"]').first()).toContainText(price)
})

When('cuenta las propiedades en la lista', async function (this: CustomWorld) {
  this.state.initialCount = await this.page.locator('[data-testid="property-card"]').count()
})

When('elimina la primera propiedad', async function (this: CustomWorld) {
  const availableCard = this.page.locator('[data-testid="property-card"]').filter({ hasNotText: 'Sold' }).first()
  await availableCard.locator('[data-testid="btn-delete-property"]').click()
})

Then('la lista tiene una propiedad menos', async function (this: CustomWorld) {
  const expected = (this.state.initialCount as number) - 1
  await expect(this.page.locator('[data-testid="property-card"]')).toHaveCount(expected)
})
