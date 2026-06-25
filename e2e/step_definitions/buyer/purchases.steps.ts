import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

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
