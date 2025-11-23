import { test, expect } from "@playwright/test"

test.describe("Minimal Test", () => {
  test("should load minimal page and define custom elements", async ({ page }) => {
    // Listen for console messages
    const logs: string[] = []
    page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`)
      console.log(`${msg.type()}: ${msg.text()}`)
    })

    // Listen for page errors
    page.on('pageerror', error => {
      console.error('Page error:', error)
    })

    // Navigate to the page
    console.log("Navigating to /test-minimal.html")
    await page.goto("/test-minimal.html")

    console.log("Page loaded, current URL:", page.url())

    // Wait for script to load
    await page.waitForTimeout(2000)

    // Check if custom elements are defined
    const elementsDefined = await page.evaluate(() => {
      return {
        button: Boolean(customElements.get('apps-button')),
        badge: Boolean(customElements.get('apps-badge')),
      }
    })

    console.log("Custom elements defined:", elementsDefined)
    console.log("Console logs:", logs)

    // Verify elements are defined
    expect(elementsDefined.button).toBeTruthy()
    expect(elementsDefined.badge).toBeTruthy()

    // Check if elements exist in DOM
    const button = page.locator('apps-button')
    await expect(button).toBeVisible()

    const badge = page.locator('apps-badge')
    await expect(badge).toBeVisible()
  })
})
