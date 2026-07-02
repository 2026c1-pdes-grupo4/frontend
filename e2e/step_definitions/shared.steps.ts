import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../support/world.ts'

Given('que el admin está autenticado en el panel', async function (this: CustomWorld) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const username = process.env.E2E_ADMIN_USER ?? ''
  const password = process.env.E2E_ADMIN_PASS ?? ''

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`)
  const { token } = await res.json() as { token: string }

  await this.page.goto(this.baseUrl)
  await this.page.evaluate((t: string) => localStorage.setItem('token', t), token)
  await this.page.goto(`${this.baseUrl}/admin`)
  await this.page.waitForSelector('[data-testid="admin-tabs"]')
})

Given('que el comprador está autenticado en el panel', async function (this: CustomWorld) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const username = process.env.E2E_BUYER_USER ?? ''
  const password = process.env.E2E_BUYER_PASS ?? ''

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`)
  const { token } = await res.json() as { token: string }
  this.state.token = token

  await this.page.goto(this.baseUrl)
  await this.page.evaluate((t: string) => localStorage.setItem('token', t), token)
  await this.page.goto(`${this.baseUrl}/properties`)
  await this.page.waitForSelector('[data-testid="properties-page"]')
})

Given('que la agencia está autenticada en el panel', async function (this: CustomWorld) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const username = process.env.E2E_AGENCY_USER ?? ''
  const password = process.env.E2E_AGENCY_PASS ?? ''

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`)
  const { token } = await res.json() as { token: string }

  await this.page.goto(this.baseUrl)
  await this.page.evaluate((t: string) => localStorage.setItem('token', t), token)
  await this.page.goto(`${this.baseUrl}/agency`)
  await this.page.waitForSelector('[data-testid="agency-tabs"]')
})
