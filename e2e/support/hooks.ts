import { Before, After, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber'
import { chromium } from '@playwright/test'
import { CustomWorld } from './world.ts'

setWorldConstructor(CustomWorld)
setDefaultTimeout(20000)

Before(async function (this: CustomWorld) {
  const headed = (this.parameters as { headless: string }).headless === 'true'
  this.browser = await chromium.launch({ headless: !headed, slowMo: headed ? 600 : 0 })
  this.context = await this.browser.newContext()
  this.page = await this.context.newPage()
})

After(async function (this: CustomWorld) {
  await this.context.close()
  await this.browser.close()
})
