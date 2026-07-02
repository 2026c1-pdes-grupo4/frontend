import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

When('hace clic en el ícono de favorito de la primera propiedad', async function (this: CustomWorld) {
  await this.page.locator('[data-testid="btn-favorite-property"]').first().click()
  await this.page.waitForSelector('[data-testid="fav-form"]')
})

When('califica con {int} estrellas y escribe el comentario {string}', async function (this: CustomWorld, stars: number, comment: string) {
  await this.page.locator(`[data-testid="star-${stars}"]`).first().click()
  await this.page.locator('[data-testid="input-fav-comment"]').first().fill(comment)
})

When('guarda el favorito', async function (this: CustomWorld) {
  await this.page.locator('[data-testid="btn-save-favorite"]').first().click()
})

Then('la propiedad aparece marcada como favorita', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="btn-favorite-property"]').first()).toHaveText('★')
})
