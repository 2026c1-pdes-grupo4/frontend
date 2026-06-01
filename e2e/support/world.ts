import { World } from '@cucumber/cucumber'
import type { IWorldOptions } from '@cucumber/cucumber'
import type { Browser, BrowserContext, Page } from '@playwright/test'

export class CustomWorld extends World {
  browser!: Browser
  context!: BrowserContext
  page!: Page
  state: Record<string, unknown> = {}
  baseUrl: string

  constructor(options: IWorldOptions) {
    super(options)
    this.baseUrl = (options.parameters as { baseUrl?: string }).baseUrl ?? 'http://localhost:5173'
  }
}
