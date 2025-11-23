import { test } from "@playwright/test"

test.describe("Debug", () => {
  test("check page content", async ({ page }) => {
    const url = "/test-components.html"
    console.log("Going to:", url)

    await page.goto(url)
    console.log("Current URL:", page.url())

    // Wait a bit for scripts to load
    await page.waitForTimeout(2000)

    // Log page HTML
    const html = await page.content()
    console.log("HTML length:", html.length)
    console.log("HTML preview:", html.substring(0, 200))

    // Log page title
    const title = await page.title()
    console.log("Page title:", title)

    // Log custom elements
    const customElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("*"))
        .map(el => el.tagName.toLowerCase())
        .filter(tag => tag.startsWith("apps-"))
      return [...new Set(elements)]
    })
    console.log("Custom elements found:", customElements)

    // Check if script loaded
    const scriptExists = await page.evaluate(() => {
      return Boolean(document.querySelector('script[src="/dist/vanilla/apps-sdk-ui.js"]'))
    })
    console.log("Script tag exists:", scriptExists)

    // Check console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser error:', msg.text())
      }
    })

    // Check if customElements are defined
    const isDefined = await page.evaluate(() => {
      return {
        button: Boolean(customElements.get("apps-button")),
        badge: Boolean(customElements.get("apps-badge")),
        input: Boolean(customElements.get("apps-input")),
        checkbox: Boolean(customElements.get("apps-checkbox")),
        switch: Boolean(customElements.get("apps-switch")),
      }
    })
    console.log("Custom elements defined:", isDefined)

    // Take screenshot
    await page.screenshot({ path: "debug-screenshot.png", fullPage: true })
    console.log("Screenshot saved to debug-screenshot.png")
  })
})
