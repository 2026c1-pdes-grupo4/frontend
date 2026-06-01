import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../support/world.ts'

// JWT with payload { roles: ['ROLE_AGENCY'] } — fixture-mode only
const AGENCY_TOKEN = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from('{"roles":["ROLE_AGENCY"]}').toString('base64')}.fake`

Given('que la agencia está autenticada en el panel', async function (this: CustomWorld) {
  await this.page.goto(this.baseUrl)
  await this.page.evaluate((token: string) => localStorage.setItem('token', token), AGENCY_TOKEN)
  await this.page.goto(`${this.baseUrl}/agency`)
  await this.page.waitForSelector('[data-testid="agency-tabs"]')
})
