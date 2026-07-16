import { Given, When } from '@cucumber/cucumber'
import { CustomWorld } from '../../support/world.ts'

async function loginAsBuyer(username: string): Promise<string> {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: 'buyer123' }),
  })
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`)
  const { token } = await res.json() as { token: string }
  return token
}

Given('que el comprador {string} compra una propiedad disponible', async function (this: CustomWorld, username: string) {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'
  const token = await loginAsBuyer(username)

  const searchRes = await fetch(`${apiUrl}/properties/search?size=100`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const { content: properties } = await searchRes.json() as { content: { address: string; available: boolean; id: number }[] }
  const target = properties.find((p) => p.available)
  if (!target) throw new Error('No available property found to purchase')

  const purchaseRes = await fetch(`${apiUrl}/purchases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ agencyPropertyId: target.id }),
  })
  if (!purchaseRes.ok) throw new Error(`Purchase setup failed: HTTP ${purchaseRes.status}`)

  this.state.purchasedAddress = target.address
})

When('el comprador {string} se autentica y navega a la página de propiedades', async function (this: CustomWorld, username: string) {
  const token = await loginAsBuyer(username)

  await this.page.goto(this.baseUrl)
  await this.page.evaluate((t: string) => localStorage.setItem('token', t), token)
  await this.page.goto(`${this.baseUrl}/properties`)
  await this.page.waitForSelector('[data-testid="properties-page"]')
})
