import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../../support/world.ts'

When('intenta iniciar sesión con usuario {string} y contraseña incorrecta', async function (this: CustomWorld, username: string) {
  await this.page.goto(`${this.baseUrl}/login`)
  await this.page.getByPlaceholder('Username').fill(username)
  await this.page.getByPlaceholder('Password').fill('wrong-password')
  await this.page.getByRole('button', { name: 'Login' }).click()
})

Then('ve un mensaje de error de autenticación', async function (this: CustomWorld) {
  await expect(this.page.locator('.login-error')).toBeVisible()
})

Then('sigue en la página de login', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(`${this.baseUrl}/login`)
})

When('navega directamente a {string}', async function (this: CustomWorld, path: string) {
  await this.page.goto(`${this.baseUrl}${path}`)
})

Then('es redirigido fuera del panel', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(`${this.baseUrl}/properties`)
})
