import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

const UNIQUE_SUFFIX = Date.now()

When('navega a la pestaña Usuarios', async function (this: CustomWorld) {
  await this.page.click('[data-testid="tab-users"]')
  await this.page.waitForSelector('[data-testid="users-table"]')
})

When('hace clic en nuevo usuario', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-new-user"]')
  await this.page.waitForSelector('[data-testid="user-form"]')
})

When('completa el formulario de usuario con datos válidos', async function (this: CustomWorld) {
  const unique = `e2euser_${UNIQUE_SUFFIX}`
  this.state.newUsername = unique
  await this.page.fill('#uf-username', unique)
  await this.page.fill('#uf-email', `${unique}@test.com`)
  await this.page.fill('#uf-password', 'pass123')
  await this.page.selectOption('#uf-profile', 'BUYER')
})

When('guarda el formulario de usuario', async function (this: CustomWorld) {
  await this.page.click('[data-testid="user-form"] .btn-primary')
  await this.page.waitForSelector('[data-testid="users-table"]')
})

Then('el nuevo usuario aparece en la tabla', async function (this: CustomWorld) {
  const username = this.state.newUsername as string
  await expect(this.page.locator('[data-testid="user-row"]', { hasText: username })).toBeVisible()
})

When('hace clic en editar sobre el primer usuario', async function (this: CustomWorld) {
  const firstRow = this.page.locator('[data-testid="user-row"]').first()
  this.state.originalUsername = await firstRow.locator('td').nth(1).textContent()
  await firstRow.locator('[data-testid="btn-edit-user"]').click()
  await this.page.waitForSelector('[data-testid="user-form"]')
})

When('modifica el username del usuario', async function (this: CustomWorld) {
  const updated = `updated_${UNIQUE_SUFFIX}`
  this.state.updatedUsername = updated
  await this.page.fill('#uf-username', updated)
})

Then('la tabla refleja el cambio de username', async function (this: CustomWorld) {
  const updated = this.state.updatedUsername as string
  await expect(this.page.locator('[data-testid="user-row"]', { hasText: updated })).toBeVisible()
})

When('hace clic en eliminar sobre el primer usuario', async function (this: CustomWorld) {
  const firstRow = this.page.locator('[data-testid="user-row"]').first()
  this.state.deletedUsername = await firstRow.locator('td').nth(1).textContent()
  await firstRow.locator('[data-testid="btn-delete-user"]').click()
})

When('confirma la eliminación del usuario', async function (this: CustomWorld) {
  // Click the "Confirm" button that appears inline after clicking Delete
  const firstRow = this.page.locator('[data-testid="user-row"]').first()
  await firstRow.locator('button', { hasText: 'Confirm' }).click()
})

Then('el usuario ya no aparece en la tabla', async function (this: CustomWorld) {
  const username = this.state.deletedUsername as string
  await expect(this.page.locator('[data-testid="user-row"]', { hasText: username })).toHaveCount(0)
})
