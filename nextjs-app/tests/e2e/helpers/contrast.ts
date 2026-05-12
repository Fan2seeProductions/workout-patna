// Custom contrast auditing utilities for Playwright
import type { Page } from '@playwright/test'

export interface ContrastIssue {
  pageUrl: string
  selector: string
  textContent: string
  textColor: string
  backgroundColor: string
  fontSize: string
  fontWeight: string
  dimensions: { width: number; height: number; x: number; y: number }
  opacity: number
  issue: string
  severity: 'critical' | 'serious' | 'moderate'
  recommendation: string
}

/**
 * Calculate relative luminance of a color (WCAG formula).
 */
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  )
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors.
 */
function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Parse a CSS color value (rgb/rgba) into r, g, b, a components.
 */
function parseColor(color: string): { r: number; g: number; b: number; a: number } | null {
  const rgba = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!rgba) return null
  return {
    r: parseInt(rgba[1]),
    g: parseInt(rgba[2]),
    b: parseInt(rgba[3]),
    a: rgba[4] !== undefined ? parseFloat(rgba[4]) : 1,
  }
}

/**
 * Checks if two colors are nearly the same (low contrast).
 */
function colorsAreSimilar(c1: string, c2: string): boolean {
  const p1 = parseColor(c1)
  const p2 = parseColor(c2)
  if (!p1 || !p2) return false
  const l1 = relativeLuminance(p1.r, p1.g, p1.b)
  const l2 = relativeLuminance(p2.r, p2.g, p2.b)
  return contrastRatio(l1, l2) < 3
}

/**
 * Check if a color is "white-ish" (very light).
 */
function isWhiteish(color: string): boolean {
  const p = parseColor(color)
  if (!p) return false
  return p.r > 220 && p.g > 220 && p.b > 220
}

/**
 * Check if a color is "dark-ish".
 */
function isDarkish(color: string): boolean {
  const p = parseColor(color)
  if (!p) return false
  return p.r < 60 && p.g < 60 && p.b < 60
}

/**
 * Run a full contrast audit on the current page.
 * Scans all visible text elements and checks computed styles.
 */
export async function runContrastAudit(page: Page): Promise<ContrastIssue[]> {
  const pageUrl = page.url()

  const rawIssues = await page.evaluate(() => {
    const issues: Array<{
      selector: string
      textContent: string
      textColor: string
      backgroundColor: string
      fontSize: string
      fontWeight: string
      dimensions: { width: number; height: number; x: number; y: number }
      opacity: number
      issue: string
    }> = []

    // Get all text-containing elements
    const textElements = document.querySelectorAll(
      'p, span, h1, h2, h3, h4, h5, h6, a, button, label, li, td, th, div, input, textarea, select, option'
    )

    for (const el of textElements) {
      const htmlEl = el as HTMLElement
      // Skip hidden elements
      const style = window.getComputedStyle(htmlEl)
      if (style.display === 'none' || style.visibility === 'hidden') continue
      if (parseFloat(style.opacity) === 0) continue

      const rect = htmlEl.getBoundingClientRect()
      // Skip zero-size elements
      if (rect.width === 0 && rect.height === 0) continue
      // Skip off-screen elements
      if (rect.bottom < 0 || rect.top > window.innerHeight * 2) continue

      // Get the text content (direct text only, not children)
      const text = htmlEl.textContent?.trim().slice(0, 100)
      if (!text) continue

      const textColor = style.color
      let bgColor = style.backgroundColor

      // Check if element or ancestor has a gradient background (not captured by backgroundColor)
      let hasGradient = style.backgroundImage !== 'none' && style.backgroundImage.includes('gradient')

      // Walk up to find actual background color if transparent
      let parent = htmlEl.parentElement
      while (parent && (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent')) {
        const parentStyle = window.getComputedStyle(parent)
        bgColor = parentStyle.backgroundColor
        if (!hasGradient && parentStyle.backgroundImage !== 'none' && parentStyle.backgroundImage.includes('gradient')) {
          hasGradient = true
        }
        parent = parent.parentElement
      }

      // Default to the body/html background if still transparent
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        const bodyStyle = window.getComputedStyle(document.body)
        const htmlStyle = window.getComputedStyle(document.documentElement)
        const bodyBg = bodyStyle.backgroundColor
        const htmlBg = htmlStyle.backgroundColor
        // Also check for background shorthand (not just background-color)
        const bodyBgImage = bodyStyle.backgroundImage
        if (bodyBg && bodyBg !== 'rgba(0, 0, 0, 0)' && bodyBg !== 'transparent') {
          bgColor = bodyBg
        } else if (htmlBg && htmlBg !== 'rgba(0, 0, 0, 0)' && htmlBg !== 'transparent') {
          bgColor = htmlBg
        } else if (bodyBgImage && bodyBgImage !== 'none') {
          // Body has a background via shorthand/gradient — skip this element
          continue
        } else {
          bgColor = 'rgb(255, 255, 255)'
        }
      }

      // Skip elements with gradient backgrounds — contrast checker can't evaluate gradients
      if (hasGradient) continue

      const opacity = parseFloat(style.opacity)

      // Generate a basic CSS selector
      let selector = htmlEl.tagName.toLowerCase()
      if (htmlEl.id) selector += `#${htmlEl.id}`
      else if (htmlEl.className && typeof htmlEl.className === 'string')
        selector += '.' + htmlEl.className.split(' ').filter(Boolean).slice(0, 2).join('.')

      // Skip decorative large text (intentionally low-opacity backgrounds/numbers)
      const fontSize = parseFloat(style.fontSize)
      if (fontSize >= 36 && opacity < 0.15) continue

      // Check for issues
      const issuesList: string[] = []

      // Check contrast ratio
      const tc = textColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      const bc = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      if (tc && bc) {
        const tR = parseInt(tc[1]), tG = parseInt(tc[2]), tB = parseInt(tc[3])
        const bR = parseInt(bc[1]), bG = parseInt(bc[2]), bB = parseInt(bc[3])

        const tLum = 0.2126 * (tR/255) + 0.7152 * (tG/255) + 0.0722 * (tB/255)
        const bLum = 0.2126 * (bR/255) + 0.7152 * (bG/255) + 0.0722 * (bB/255)
        const lighter = Math.max(tLum, bLum)
        const darker = Math.min(tLum, bLum)
        const ratio = (lighter + 0.05) / (darker + 0.05)

        const fontSize = parseFloat(style.fontSize)
        const isBold = parseInt(style.fontWeight) >= 700
        const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && isBold)
        const minRatio = isLargeText ? 3 : 4.5

        if (ratio < minRatio) {
          // White on white
          if (tR > 200 && tG > 200 && tB > 200 && bR > 200 && bG > 200 && bB > 200) {
            issuesList.push(`WHITE-ON-WHITE: text is nearly invisible (ratio: ${ratio.toFixed(2)})`)
          }
          // Dark on dark
          else if (tR < 80 && tG < 80 && tB < 80 && bR < 80 && bG < 80 && bB < 80) {
            issuesList.push(`DARK-ON-DARK: text is nearly invisible (ratio: ${ratio.toFixed(2)})`)
          }
          // Generic low contrast
          else {
            issuesList.push(`LOW-CONTRAST: ratio ${ratio.toFixed(2)} (need ${minRatio}) — text may be hard to read`)
          }
        }
      }

      // Check zero-dimension text
      if (rect.width < 1 || rect.height < 1) {
        issuesList.push('ZERO-SIZE: element has no visible dimensions')
      }

      // Check very low opacity
      if (opacity > 0 && opacity < 0.3) {
        issuesList.push(`LOW-OPACITY: opacity is ${opacity}, text may be unreadable`)
      }

      for (const issue of issuesList) {
        issues.push({
          selector,
          textContent: text,
          textColor,
          backgroundColor: bgColor,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          dimensions: { width: rect.width, height: rect.height, x: rect.x, y: rect.y },
          opacity,
          issue,
        })
      }
    }

    return issues
  })

  // Classify severity and add recommendations
  return rawIssues.map(raw => {
    let severity: ContrastIssue['severity'] = 'moderate'
    let recommendation = ''

    if (raw.issue.includes('WHITE-ON-WHITE')) {
      severity = 'critical'
      recommendation = 'Change text color to a dark color (text-gray-900) or change background to dark (bg-gray-900 with text-white)'
    } else if (raw.issue.includes('DARK-ON-DARK')) {
      severity = 'critical'
      recommendation = 'Change text color to white or light gray (text-white or text-gray-200) for dark backgrounds'
    } else if (raw.issue.includes('ZERO-SIZE')) {
      severity = 'serious'
      recommendation = 'Ensure the element has proper width/height or is properly hidden with display:none'
    } else if (raw.issue.includes('LOW-OPACITY')) {
      severity = 'serious'
      recommendation = 'Increase opacity to at least 0.5, or use a more visible color'
    } else if (raw.issue.includes('LOW-CONTRAST')) {
      severity = 'serious'
      recommendation = 'Increase contrast ratio to at least 4.5:1 for normal text or 3:1 for large text'
    }

    return { ...raw, pageUrl, severity, recommendation }
  })
}

/**
 * Check for horizontal overflow (unintended scrollbar).
 */
export async function checkHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    return document.body.scrollWidth > document.documentElement.clientWidth
  })
}

/**
 * Check that important elements are visible and clickable.
 */
export async function checkElementVisibility(page: Page, selector: string): Promise<{
  exists: boolean
  visible: boolean
  clickable: boolean
  inViewport: boolean
}> {
  const result = await page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null
    if (!el) return { exists: false, visible: false, clickable: false, inViewport: false }

    const style = window.getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    const visible = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0
    const clickable = visible && inViewport && style.pointerEvents !== 'none'

    return { exists: true, visible, clickable, inViewport }
  }, selector)

  return result
}
