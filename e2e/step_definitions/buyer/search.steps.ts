import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

When('filtra por ciudad {string}', async function (this: CustomWorld, city: string) {
  await this.page.getByPlaceholder('City').fill(city)
})

When('filtra por precio mínimo {string} y precio máximo {string}', async function (this: CustomWorld, min: string, max: string) {
  await this.page.getByPlaceholder('Min price').fill(min)
  await this.page.getByPlaceholder('Max price').fill(max)
})

When('cuenta las propiedades del listado de búsqueda', async function (this: CustomWorld) {
  this.state.initialPropertiesCount = await this.page.locator('.property-card').count()
})

When('hace clic en {string}', async function (this: CustomWorld, buttonText: string) {
  await this.page.getByRole('button', { name: buttonText, exact: true }).click()
})

Then('hay al menos una propiedad en la lista', async function (this: CustomWorld) {
  await expect(this.page.locator('.property-card').first()).toBeVisible()
})

Then('todas las propiedades de la lista son de la ciudad {string}', async function (this: CustomWorld, city: string) {
  const cities = await this.page.locator('.property-card__city').allTextContents()
  for (const text of cities) {
    expect(text).toContain(city)
  }
})

Then('todas las propiedades de la lista tienen un precio entre {string} y {string}', async function (this: CustomWorld, min: string, max: string) {
  const prices = await this.page.locator('.property-card__price').allTextContents()
  for (const text of prices) {
    const value = Number(text.replace(/[^0-9]/g, ''))
    expect(value).toBeGreaterThanOrEqual(Number(min))
    expect(value).toBeLessThanOrEqual(Number(max))
  }
})

Then('la lista de propiedades vuelve a tener la misma cantidad que al principio', async function (this: CustomWorld) {
  const expected = this.state.initialPropertiesCount as number
  await expect(this.page.locator('.property-card')).toHaveCount(expected)
})
