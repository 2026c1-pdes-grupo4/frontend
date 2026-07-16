import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

const UNIQUE_SUFFIX = Date.now()

When('navega a la pestaña Agencias', async function (this: CustomWorld) {
  await this.page.click('[data-testid="tab-agencies"]')
  await this.page.waitForSelector('.admin-table')
})

When('hace clic en nueva agencia', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-new-agency"]')
  await this.page.waitForSelector('[data-testid="agency-form"]')
})

When('completa el formulario de agencia con datos válidos', async function (this: CustomWorld) {
  const unique = `e2eagency_${UNIQUE_SUFFIX}`
  this.state.newAgencyUsername = unique
  await this.page.fill('#af-username', unique)
  await this.page.fill('#af-email', `${unique}@test.com`)
  await this.page.fill('#af-password', 'pass123')
})

When('guarda el formulario de agencia', async function (this: CustomWorld) {
  await this.page.click('[data-testid="agency-form"] .btn-primary')
  await this.page.waitForSelector('.admin-table')
})

Then('la nueva agencia aparece en la tabla de agencias', async function (this: CustomWorld) {
  const username = this.state.newAgencyUsername as string
  await expect(this.page.locator('[data-testid="agency-row"]', { hasText: username })).toBeVisible()
})

When('hace clic en editar sobre la primera agencia', async function (this: CustomWorld) {
  const firstRow = this.page.locator('[data-testid="agency-row"]').first()
  this.state.originalAgencyUsername = await firstRow.locator('td').nth(1).textContent()
  await firstRow.locator('[data-testid="btn-edit-agency"]').click()
  await this.page.waitForSelector('[data-testid="agency-form"]')
})

When('modifica el username de la agencia', async function (this: CustomWorld) {
  const updated = `updated_agency_${UNIQUE_SUFFIX}`
  this.state.updatedAgencyUsername = updated
  await this.page.fill('#af-username', updated)
})

Then('la tabla de agencias refleja el cambio de username', async function (this: CustomWorld) {
  const updated = this.state.updatedAgencyUsername as string
  await expect(this.page.locator('[data-testid="agency-row"]', { hasText: updated })).toBeVisible()
})

When('hace clic en eliminar sobre la primera agencia', async function (this: CustomWorld) {
  const firstRow = this.page.locator('[data-testid="agency-row"]').first()
  this.state.deletedAgencyUsername = await firstRow.locator('td').nth(1).textContent()
  await firstRow.locator('[data-testid="btn-delete-agency"]').click()
})

When('confirma la eliminación de la agencia', async function (this: CustomWorld) {
  const firstRow = this.page.locator('[data-testid="agency-row"]').first()
  await firstRow.locator('button', { hasText: 'Confirm' }).click()
})

Then('la agencia ya no aparece en la tabla de agencias', async function (this: CustomWorld) {
  const username = this.state.deletedAgencyUsername as string
  await expect(this.page.locator('[data-testid="agency-row"]', { hasText: username })).toHaveCount(0)
})
