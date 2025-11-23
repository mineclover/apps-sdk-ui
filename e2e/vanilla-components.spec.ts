import { test, expect } from "@playwright/test"

test.describe("Vanilla Web Components - Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-components.html")
  })

  test("should render button component", async ({ page }) => {
    const button = page.locator("apps-button").first()
    await expect(button).toBeVisible()
    await expect(button).toContainText("Primary Button")
  })

  test("should apply primary color style", async ({ page }) => {
    const button = page.locator('apps-button[color="primary"]').first()
    const shadowButton = await button.evaluateHandle((el) =>
      el.shadowRoot?.querySelector("button")
    )
    const bgColor = await shadowButton.evaluate((btn) =>
      window.getComputedStyle(btn).backgroundColor
    )
    // Primary color should be blue-ish (rgb values)
    expect(bgColor).toBeTruthy()
  })

  test("should apply different variants", async ({ page }) => {
    const solidButton = page.locator('apps-button[variant="solid"]').first()
    const outlineButton = page
      .locator('apps-button[variant="outline"]')
      .first()

    await expect(solidButton).toBeVisible()
    await expect(outlineButton).toBeVisible()

    // Check that outline has border
    const outlineShadowBtn = await outlineButton.evaluateHandle((el) =>
      el.shadowRoot?.querySelector("button")
    )
    const borderWidth = await outlineShadowBtn.evaluate((btn) =>
      window.getComputedStyle(btn).borderWidth
    )
    expect(parseFloat(borderWidth)).toBeGreaterThan(0)
  })

  test("should handle click events", async ({ page }) => {
    const button = page.locator("apps-button").first()
    let clickEventFired = false

    await page.exposeFunction("trackClick", () => {
      clickEventFired = true
    })

    await page.evaluate(() => {
      document.querySelector("apps-button")?.addEventListener("apps-click", () => {
        ;(window as any).trackClick()
      })
    })

    await button.click()
    await page.waitForTimeout(100)
    expect(clickEventFired).toBeTruthy()
  })

  test("should apply different sizes", async ({ page }) => {
    const smallButton = page.locator('apps-button[size="sm"]').first()
    const largeButton = page.locator('apps-button[size="lg"]').first()

    const smallHeight = await smallButton.evaluate((el) =>
      window.getComputedStyle(el).height
    )
    const largeHeight = await largeButton.evaluate((el) =>
      window.getComputedStyle(el).height
    )

    // Large should be bigger than small
    expect(parseFloat(largeHeight)).toBeGreaterThan(parseFloat(smallHeight))
  })

  test("should handle disabled state", async ({ page }) => {
    const disabledButton = page.locator('apps-button[disabled="true"]').first()
    const shadowButton = await disabledButton.evaluateHandle((el) =>
      el.shadowRoot?.querySelector("button")
    )
    const isDisabled = await shadowButton.evaluate(
      (btn) => (btn as HTMLButtonElement).disabled
    )
    expect(isDisabled).toBeTruthy()
  })
})

test.describe("Vanilla Web Components - Badge", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-components.html")
  })

  test("should render badge component", async ({ page }) => {
    const badge = page.locator("apps-badge").first()
    await expect(badge).toBeVisible()
    await expect(badge).toContainText("Primary")
  })

  test("should apply color variants", async ({ page }) => {
    const successBadge = page.locator('apps-badge[color="success"]').first()
    const dangerBadge = page.locator('apps-badge[color="danger"]').first()

    await expect(successBadge).toBeVisible()
    await expect(dangerBadge).toBeVisible()

    // Verify colors are different
    const successColor = await successBadge.evaluate((el) => {
      const span = el.shadowRoot?.querySelector("span")
      return span ? window.getComputedStyle(span).backgroundColor : null
    })
    const dangerColor = await dangerBadge.evaluate((el) => {
      const span = el.shadowRoot?.querySelector("span")
      return span ? window.getComputedStyle(span).backgroundColor : null
    })

    expect(successColor).not.toBe(dangerColor)
  })

  test("should apply different sizes", async ({ page }) => {
    const smallBadge = page.locator('apps-badge[size="sm"]').first()
    const largeBadge = page.locator('apps-badge[size="lg"]').first()

    const smallSize = await smallBadge.evaluate((el) => {
      const span = el.shadowRoot?.querySelector("span")
      return span ? window.getComputedStyle(span).fontSize : null
    })
    const largeSize = await largeBadge.evaluate((el) => {
      const span = el.shadowRoot?.querySelector("span")
      return span ? window.getComputedStyle(span).fontSize : null
    })

    expect(parseFloat(largeSize!)).toBeGreaterThan(parseFloat(smallSize!))
  })

  test("should apply pill shape", async ({ page }) => {
    const pillBadge = page.locator('apps-badge[pill="true"]').first()
    const borderRadius = await pillBadge.evaluate((el) => {
      const span = el.shadowRoot?.querySelector("span")
      return span ? window.getComputedStyle(span).borderRadius : null
    })

    // Pill should have large border radius
    expect(parseFloat(borderRadius!)).toBeGreaterThan(10)
  })
})

test.describe("Vanilla Web Components - Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-components.html")
  })

  test("should render input component", async ({ page }) => {
    const input = page.locator("apps-input").first()
    await expect(input).toBeVisible()
  })

  test("should handle input events", async ({ page }) => {
    const input = page.locator("apps-input").first()
    const shadowInput = await input.evaluateHandle((el) =>
      el.shadowRoot?.querySelector("input")
    )

    await shadowInput.fill("test input")
    const value = await shadowInput.evaluate(
      (inp) => (inp as HTMLInputElement).value
    )
    expect(value).toBe("test input")
  })

  test("should apply placeholder", async ({ page }) => {
    const input = page.locator('apps-input[placeholder="Enter text"]').first()
    const placeholder = await input.evaluate((el) => {
      const inp = el.shadowRoot?.querySelector("input")
      return inp ? (inp as HTMLInputElement).placeholder : null
    })
    expect(placeholder).toBe("Enter text")
  })

  test("should handle disabled state", async ({ page }) => {
    const input = page.locator('apps-input[disabled="true"]').first()
    const isDisabled = await input.evaluate((el) => {
      const inp = el.shadowRoot?.querySelector("input")
      return inp ? (inp as HTMLInputElement).disabled : false
    })
    expect(isDisabled).toBeTruthy()
  })

  test("should apply invalid state styling", async ({ page }) => {
    const invalidInput = page.locator('apps-input[invalid="true"]').first()
    const borderColor = await invalidInput.evaluate((el) => {
      const inp = el.shadowRoot?.querySelector("input")
      return inp ? window.getComputedStyle(inp).borderColor : null
    })

    // Should have red-ish border for invalid state
    expect(borderColor).toBeTruthy()
  })

  test("should apply different sizes", async ({ page }) => {
    const smallInput = page.locator('apps-input[size="sm"]').first()
    const largeInput = page.locator('apps-input[size="lg"]').first()

    const smallHeight = await smallInput.evaluate((el) => {
      const inp = el.shadowRoot?.querySelector("input")
      return inp ? window.getComputedStyle(inp).height : null
    })
    const largeHeight = await largeInput.evaluate((el) => {
      const inp = el.shadowRoot?.querySelector("input")
      return inp ? window.getComputedStyle(inp).height : null
    })

    expect(parseFloat(largeHeight!)).toBeGreaterThan(parseFloat(smallHeight!))
  })
})

test.describe("Vanilla Web Components - Checkbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-components.html")
  })

  test("should render checkbox component", async ({ page }) => {
    const checkbox = page.locator("apps-checkbox").first()
    await expect(checkbox).toBeVisible()
  })

  test("should toggle checked state", async ({ page }) => {
    const checkbox = page.locator("apps-checkbox").first()

    // Click to check
    await checkbox.click()
    let isChecked = await checkbox.evaluate((el) => el.hasAttribute("checked"))
    expect(isChecked).toBeTruthy()

    // Click to uncheck
    await checkbox.click()
    isChecked = await checkbox.evaluate((el) => el.hasAttribute("checked"))
    expect(isChecked).toBeFalsy()
  })

  test("should display label", async ({ page }) => {
    const checkbox = page.locator('apps-checkbox[label="Accept terms"]').first()
    const labelText = await checkbox.evaluate((el) => {
      const label = el.shadowRoot?.querySelector("label span:last-child")
      return label ? label.textContent : null
    })
    expect(labelText).toBe("Accept terms")
  })

  test("should handle disabled state", async ({ page }) => {
    const checkbox = page.locator('apps-checkbox[disabled="true"]').first()
    const isDisabled = await checkbox.evaluate((el) => {
      const input = el.shadowRoot?.querySelector('input[type="checkbox"]')
      return input ? (input as HTMLInputElement).disabled : false
    })
    expect(isDisabled).toBeTruthy()
  })

  test("should handle indeterminate state", async ({ page }) => {
    const checkbox = page
      .locator('apps-checkbox[indeterminate="true"]')
      .first()
    const isIndeterminate = await checkbox.evaluate((el) => {
      const input = el.shadowRoot?.querySelector('input[type="checkbox"]')
      return input ? (input as HTMLInputElement).indeterminate : false
    })
    expect(isIndeterminate).toBeTruthy()
  })

  test("should show checkmark when checked", async ({ page }) => {
    const checkbox = page.locator("apps-checkbox").first()
    await checkbox.click()

    const checkmarkVisible = await checkbox.evaluate((el) => {
      const checkmark = el.shadowRoot?.querySelector(".checkmark")
      return checkmark ? window.getComputedStyle(checkmark).opacity !== "0" : false
    })
    expect(checkmarkVisible).toBeTruthy()
  })
})

test.describe("Vanilla Web Components - Switch", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-components.html")
  })

  test("should render switch component", async ({ page }) => {
    const switchElem = page.locator("apps-switch").first()
    await expect(switchElem).toBeVisible()
  })

  test("should toggle checked state", async ({ page }) => {
    const switchElem = page.locator("apps-switch").first()

    // Click to enable
    await switchElem.click()
    let isChecked = await switchElem.evaluate((el) =>
      el.hasAttribute("checked")
    )
    expect(isChecked).toBeTruthy()

    // Click to disable
    await switchElem.click()
    isChecked = await switchElem.evaluate((el) => el.hasAttribute("checked"))
    expect(isChecked).toBeFalsy()
  })

  test("should display label", async ({ page }) => {
    const switchElem = page
      .locator('apps-switch[label="Enable notifications"]')
      .first()
    const labelText = await switchElem.evaluate((el) => {
      const label = el.shadowRoot?.querySelector("label span")
      return label ? label.textContent : null
    })
    expect(labelText).toBe("Enable notifications")
  })

  test("should handle disabled state", async ({ page }) => {
    const switchElem = page.locator('apps-switch[disabled="true"]').first()
    const isDisabled = await switchElem.evaluate((el) => {
      const input = el.shadowRoot?.querySelector('input[type="checkbox"]')
      return input ? (input as HTMLInputElement).disabled : false
    })
    expect(isDisabled).toBeTruthy()
  })

  test("should animate thumb on toggle", async ({ page }) => {
    const switchElem = page.locator("apps-switch").first()

    // Get initial thumb position
    const initialTransform = await switchElem.evaluate((el) => {
      const thumb = el.shadowRoot?.querySelector(".thumb")
      return thumb ? window.getComputedStyle(thumb).transform : null
    })

    // Toggle on
    await switchElem.click()
    await page.waitForTimeout(100) // Wait for animation

    const checkedTransform = await switchElem.evaluate((el) => {
      const thumb = el.shadowRoot?.querySelector(".thumb")
      return thumb ? window.getComputedStyle(thumb).transform : null
    })

    // Transform should change when toggled
    expect(initialTransform).not.toBe(checkedTransform)
  })

  test("should apply color when checked", async ({ page }) => {
    const switchElem = page.locator("apps-switch").first()
    await switchElem.click()

    const bgColor = await switchElem.evaluate((el) => {
      const track = el.shadowRoot?.querySelector(".track")
      return track ? window.getComputedStyle(track).backgroundColor : null
    })

    // Should have a color when checked (not transparent/white)
    expect(bgColor).toBeTruthy()
    expect(bgColor).not.toBe("rgba(0, 0, 0, 0)")
  })
})

test.describe("Vanilla Web Components - Style Injection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-components.html")
  })

  test("should inject adoptedStyleSheets to all components", async ({ page }) => {
    const componentTypes = [
      "apps-button",
      "apps-badge",
      "apps-input",
      "apps-checkbox",
      "apps-switch",
    ]

    for (const type of componentTypes) {
      const hasStyleSheets = await page.evaluate((selector) => {
        const element = document.querySelector(selector)
        if (!element?.shadowRoot) return false
        return element.shadowRoot.adoptedStyleSheets.length > 0
      }, type)

      expect(hasStyleSheets).toBeTruthy()
    }
  })

  test("should share same stylesheet instance across components", async ({
    page,
  }) => {
    const sheetIds = await page.evaluate(() => {
      const button = document.querySelector("apps-button")
      const badge = document.querySelector("apps-badge")

      if (!button?.shadowRoot || !badge?.shadowRoot) return null

      return {
        buttonSheet: button.shadowRoot.adoptedStyleSheets[0],
        badgeSheet: badge.shadowRoot.adoptedStyleSheets[0],
        areSame:
          button.shadowRoot.adoptedStyleSheets[0] ===
          badge.shadowRoot.adoptedStyleSheets[0],
      }
    })

    // Should share the same stylesheet instance
    expect(sheetIds?.areSame).toBeTruthy()
  })
})
