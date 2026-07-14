import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

When('navega a la pestaña Inmobiliarias', async function (this: CustomWorld) {
  await this.page.click('[data-testid="tab-agencies"]')
})

When('hace clic en Nuevo Usuario', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-new-user"]')
  await this.page.waitForSelector('[data-testid="user-form"]')
})

When('completa el formulario de usuario y lo guarda', async function (this: CustomWorld) {
  const suffix = Date.now()
  this.state.newUsername = `e2e_user_${suffix}`
  await this.page.fill('[data-testid="input-username"]', this.state.newUsername as string)
  await this.page.fill('[data-testid="input-email"]', `e2e_user_${suffix}@cth.com`)
  await this.page.fill('[data-testid="input-password"]', 'secret123')
  await this.page.click('[data-testid="btn-submit-user"]')
})

When('cancela el formulario de usuario', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-cancel-user"]')
})

When('hace clic en Nueva Inmobiliaria', async function (this: CustomWorld) {
  await this.page.click('[data-testid="btn-new-agency"]')
  await this.page.waitForSelector('[data-testid="agency-form"]')
})

When('completa el formulario de inmobiliaria y lo guarda', async function (this: CustomWorld) {
  const suffix = Date.now()
  this.state.newAgencyUsername = `e2e_agency_${suffix}`
  await this.page.fill('[data-testid="input-username"]', this.state.newAgencyUsername as string)
  await this.page.fill('[data-testid="input-email"]', `e2e_agency_${suffix}@cth.com`)
  await this.page.fill('[data-testid="input-password"]', 'secret123')
  await this.page.click('[data-testid="btn-submit-agency"]')
})

Then('el nuevo usuario aparece en la tabla de usuarios', async function (this: CustomWorld) {
  await expect(this.page.getByText(this.state.newUsername as string, { exact: true })).toBeVisible()
})

Then('el formulario de usuario ya no está visible', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="user-form"]')).toHaveCount(0)
})

Then('la nueva inmobiliaria aparece en la tabla de inmobiliarias', async function (this: CustomWorld) {
  await expect(this.page.getByText(this.state.newAgencyUsername as string, { exact: true })).toBeVisible()
})
