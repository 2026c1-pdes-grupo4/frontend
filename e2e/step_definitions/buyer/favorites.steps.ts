import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

Given('que ya tiene una propiedad guardada como favorita', async function (this: CustomWorld) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const token = this.state.token as string

  const favRes = await fetch(`${apiUrl}/favorites/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const favorites = await favRes.json() as { propertyAddress: string }[]
  if (favorites.length > 0) {
    this.state.favoriteAddress = favorites[0].propertyAddress
    return
  }

  const searchRes = await fetch(`${apiUrl}/properties/search`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const properties = await searchRes.json() as { id: number; address: string }[]
  const target = properties[0]
  if (!target) throw new Error('No property found to favorite')

  const createRes = await fetch(`${apiUrl}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ agencyPropertyId: target.id, score: 3, comment: 'setup comment' }),
  })
  if (!createRes.ok) throw new Error(`Favorite setup failed: HTTP ${createRes.status}`)
  this.state.favoriteAddress = target.address
})

When('hace clic en el botón de favorito de una propiedad disponible', async function (this: CustomWorld) {
  const card = this.page.locator('.property-card').filter({
    has: this.page.locator('[data-testid="btn-toggle-favorite"][title="Add to favorites"]'),
  }).first()
  this.state.favoriteAddress = await card.locator('.property-card__address').textContent()
  await card.locator('[data-testid="btn-toggle-favorite"]').click()
  await this.page.waitForSelector('[data-testid="favorite-form"]')
})

When('completa el formulario de favorito con puntaje {int} y comentario {string}', async function (this: CustomWorld, score: number, comment: string) {
  await this.page.click(`[data-testid="star-${score}"]`)
  await this.page.fill('[data-testid="input-favorite-comment"]', comment)
})

When('envía el formulario de favorito', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-submit-favorite"]')
})

When('navega a la página de favoritos', async function (this: CustomWorld) {
  await this.page.goto(`${this.baseUrl}/favorites`)
  await this.page.waitForSelector('[data-testid="favorites-list"], .fav-empty')
})

Then('esa propiedad aparece en la lista de favoritos con puntaje {int} y comentario {string}', async function (this: CustomWorld, score: number, comment: string) {
  const address = this.state.favoriteAddress as string
  // .last(): addFavorite appends, and two listings of the same property (see
  // duplicate-property.feature) can legitimately share address text, so the
  // most recently added matching card is the one this scenario just created.
  const card = this.page.locator('[data-testid="favorite-card"]').filter({ hasText: address }).last()
  await expect(card).toBeVisible()
  await expect(card).toContainText('★'.repeat(score) + '☆'.repeat(5 - score))
  await expect(card).toContainText(comment)
})

When('hace clic en editar el primer favorito', async function (this: CustomWorld) {
  await this.page.locator('[data-testid="btn-edit-favorite"]').first().click()
  await this.page.waitForSelector('[data-testid="favorite-edit-form"]')
})

When('cambia el puntaje a {int} y el comentario a {string}', async function (this: CustomWorld, score: number, comment: string) {
  await this.page.click(`[data-testid="star-${score}"]`)
  await this.page.fill('[data-testid="input-edit-favorite-comment"]', comment)
})

When('guarda los cambios del favorito', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-submit-edit-favorite"]')
  await this.page.waitForSelector('[data-testid="favorite-edit-form"]', { state: 'detached' })
})

Then('el primer favorito muestra puntaje {int} y comentario {string}', async function (this: CustomWorld, score: number, comment: string) {
  const card = this.page.locator('[data-testid="favorite-card"]').first()
  await expect(card).toContainText('★'.repeat(score) + '☆'.repeat(5 - score))
  await expect(card).toContainText(comment)
})

When('cuenta los favoritos en la lista', async function (this: CustomWorld) {
  this.state.initialFavoritesCount = await this.page.locator('[data-testid="favorite-card"]').count()
})

When('elimina el primer favorito', async function (this: CustomWorld) {
  await this.page.locator('[data-testid="btn-delete-favorite"]').first().click()
})

Then('la lista de favoritos tiene un elemento menos', async function (this: CustomWorld) {
  const expected = (this.state.initialFavoritesCount as number) - 1
  await expect(this.page.locator('[data-testid="favorite-card"]')).toHaveCount(expected)
})
