import { expect, test } from '@playwright/test'

const routes = [
  ['/', 'BUILDING'],
  ['/about-us', 'A place to begin.'],
  ['/about-us/founders', 'The people behind the vision.'],
  ['/projects', 'Projects, with purpose.'],
  ['/projects/completed', 'Projects, with purpose.'],
  ['/projects/ongoing', 'Projects, with purpose.'],
  ['/projects/upcoming', 'Projects, with purpose.'],
  ['/other-businesses', 'Different disciplines. Distinct identities.'],
  ['/contact', 'Let’s start a conversation.'],
  ['/privacy-policy', 'Privacy policy.'],
  ['/terms-of-use', 'Terms of use.'],
]

test('page loads immediately without blocking preloader and navigates', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.site-preloader')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: /BUILDING/ })).toBeVisible()
  await page.getByRole('link', { name: 'Explore projects' }).click()
  await expect(page).toHaveURL('/projects')
})

test('GSAP smooth scroll handles anchors and route changes', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.getByRole('contentinfo').getByRole('link', { name: /Back to top/ }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 2500 }).toBeLessThan(8)

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.getByRole('contentinfo').getByRole('link', { name: 'Projects' }).click()
  await expect(page).toHaveURL('/projects')
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 2500 }).toBeLessThan(8)
})

test('mouse wheel scrolling eases over time', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.goto('/other-businesses')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.mouse.wheel(0, 600)
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 1000 }).toBeGreaterThan(0)
  const earlyPosition = await page.evaluate(() => window.scrollY)
  await page.waitForTimeout(100)
  const laterPosition = await page.evaluate(() => window.scrollY)
  expect(laterPosition).toBeGreaterThan(earlyPosition)
})

test('floating back-to-top button appears after scrolling and returns smoothly', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.goto('/')
  const button = page.locator('.back-to-top-float')
  await expect(button).not.toBeVisible()
  await page.mouse.wheel(0, 900)
  await expect(button).toHaveClass(/is-visible/)
  await expect(button).toBeVisible()
  const bounds = await button.boundingBox()
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(1280)
  await button.click()
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 2500 }).toBeLessThan(8)
  await expect(button).not.toBeVisible()
})

test('reduced motion skips the brand preloader', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4173/')
  await expect(page.locator('.site-preloader')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: /BUILDING/ })).toBeVisible()
  await context.close()
})

test('testimonial sections display clearly marked sample data on requested pages', async ({ page }) => {
  for (const route of ['/', '/contact', '/projects']) {
    await page.goto(route)
    const section = page.locator('.testimonial-section')
    await expect(section).toBeVisible()
    await expect(section.getByText('Fictional sample content only. These are not real client endorsements.')).toBeVisible()
    await expect(section.locator('.testimonial-card')).toHaveCount(12)
  }
})

for (const [path, heading] of routes) {
  test(`route ${path} renders`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByRole('heading', { name: heading, exact: false }).first()).toBeVisible()
  })
}

test('desktop mega menu opens by keyboard and links to About', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.goto('/')
  await page.getByRole('button', { name: 'About Us' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('region', { name: 'About Us menu' })).toBeVisible()
  await page.getByRole('link', { name: /Our story/ }).click()
  await expect(page).toHaveURL('/about-us')
})

test('mega menu closes when moving to Contact', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.goto('/')
  await page.getByRole('button', { name: 'Other Businesses' }).hover()
  await expect(page.getByRole('region', { name: 'Other Businesses menu' })).toBeVisible()
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact' }).hover()
  await expect(page.getByRole('region', { name: 'Other Businesses menu' })).toHaveCount(0)
})

test('tablet-width mega menu stays within the viewport', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.setViewportSize({ width: 900, height: 760 })
  await page.goto('/')
  await page.getByRole('button', { name: 'About Us' }).click()
  const menu = page.locator('.mega-menu')
  await expect(menu).toBeVisible()
  await expect(menu.getByRole('link', { name: /Our story/ })).toBeVisible()
  const bounds = await menu.evaluate((element) => ({
    left: element.getBoundingClientRect().left,
    right: element.getBoundingClientRect().right,
    viewport: document.documentElement.clientWidth,
  }))
  expect(bounds.left).toBeGreaterThanOrEqual(0)
  expect(bounds.right).toBeLessThanOrEqual(bounds.viewport)
})

test('desktop hamburger opens fullscreen navigation', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByRole('navigation', { name: 'Full-screen navigation' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close navigation' })).toBeFocused()
  await expect.poll(() => page.locator('.menu-panel').evaluate((panel) => panel.getBoundingClientRect().left)).toBeLessThan(1)
})

test('header marks the active section on nested routes', async ({ page }) => {
  await page.goto('/about-us/founders')
  await expect(page.getByRole('button', { name: 'About Us' })).toHaveAttribute('aria-current', 'page')
  await page.goto('/projects/ongoing')
  await expect(page.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
})

test('home hero has clear spacing without corner labels or scroll cue', async ({ page }) => {
  for (const [width, height] of [[1090, 735], [375, 812]]) {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    const headline = page.locator('.home-hero h1')
    await expect(headline).toBeVisible()
    await expect(page.locator('.hero-index')).toHaveCount(0)
    await expect(page.locator('.scroll-cue')).toHaveCount(0)
    const layout = await page.evaluate(() => {
      const heading = document.querySelector('.home-hero h1').getBoundingClientRect()
      const copy = document.querySelector('.hero-bottom').getBoundingClientRect()
      return {
        gap: copy.top - heading.bottom,
        headlineFont: Number.parseFloat(getComputedStyle(document.querySelector('.home-hero h1')).fontSize),
        heroHeight: document.querySelector('.home-hero').getBoundingClientRect().height,
        viewportHeight: innerHeight,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }
    })
    expect(layout.gap).toBeGreaterThanOrEqual(24)
    expect(layout.headlineFont).toBeLessThan(width < 700 ? 36 : 73)
    expect(layout.overflow).toBe(false)
    if (width < 700) expect(layout.heroHeight).toBeLessThan(layout.viewportHeight)
  }
})

test('mobile full-screen navigation opens and closes with Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile)
  await page.goto('/')
  await page.setViewportSize({ width: 320, height: 800 })
  await page.getByRole('button', { name: 'Open navigation' }).click()
  const navigation = page.getByRole('navigation', { name: 'Full-screen navigation' })
  await expect(navigation).toBeVisible()
  await expect(navigation.getByRole('link')).toHaveCount(5)
  await expect.poll(() => page.locator('.menu-panel').evaluate((panel) => panel.getBoundingClientRect().left)).toBeLessThan(1)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('navigation', { name: 'Full-screen navigation' })).not.toBeVisible()
})

test('mobile navigation closes after route selection', async ({ page, isMobile }) => {
  test.skip(!isMobile)
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('navigation', { name: 'Full-screen navigation' }).getByRole('link', { name: /About us/ }).click()
  await expect(page).toHaveURL('/about-us')
  await expect(page.getByRole('navigation', { name: 'Full-screen navigation' })).not.toBeVisible()
})

test('theme choice persists across navigation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.goto('/projects')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('project search shows an honest empty result', async ({ page }) => {
  await page.goto('/projects')
  await page.getByRole('textbox', { name: 'Search projects' }).fill('unknown development')
  await expect(page.getByText('No verified projects match this search.')).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await expect(page.getByText('Project information is being verified.')).toBeVisible()
})

test('project status tabs navigate to their listing routes', async ({ page }) => {
  await page.goto('/projects')
  await page.getByRole('button', { name: 'Ongoing' }).click()
  await expect(page).toHaveURL('/projects/ongoing')
  await expect(page.getByRole('button', { name: 'Ongoing' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'All' }).click()
  await expect(page).toHaveURL('/projects')
})

test('FAQ accordion exposes and collapses answers accessibly', async ({ page }) => {
  await page.goto('/')
  const firstQuestion = page.getByRole('button', { name: 'Where can I find current project details?' })
  const secondQuestion = page.getByRole('button', { name: 'How can I contact Bothra Buildtech?' })
  await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true')
  await secondQuestion.click()
  await expect(secondQuestion).toHaveAttribute('aria-expanded', 'true')
  await expect(firstQuestion).toHaveAttribute('aria-expanded', 'false')
})

test('key routes have no horizontal overflow on mobile, tablet, or desktop', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile)
  const routes = ['/', '/about-us', '/projects', '/other-businesses', '/contact']
  for (const [width, height] of [[320, 800], [375, 812], [768, 1024], [1440, 900]]) {
    await page.setViewportSize({ width, height })
    for (const route of routes) {
      await page.goto(route)
      await expect(page.locator('main h1').first()).toBeVisible()
      const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
      expect(overflows, `overflow at ${width}px on ${route}`).toBe(false)
    }
  }
})

test('all local visual references are shown and served', async ({ page }) => {
  await page.goto('/other-businesses')
  const images = page.locator('.visual-gallery img')
  await expect(images).toHaveCount(19)
  for (const image of await images.all()) {
    const source = await image.getAttribute('src')
    const response = await page.request.get(new URL(source, page.url()).toString())
    await expect(response.ok(), `${source} should be available locally`).toBeTruthy()
  }
  await expect(page.getByText(/No project, location, company affiliation, or ownership is implied/)).toBeVisible()
})

test('every page hero uses local imagery and shows its illustrative label', async ({ page }) => {
  const routes = [
    '/',
    '/about-us',
    '/about-us/founders',
    '/projects',
    '/projects/completed',
    '/projects/ongoing',
    '/projects/upcoming',
    '/projects/unverified-example',
    '/other-businesses',
    '/contact',
    '/privacy-policy',
    '/terms-of-use',
    '/not-a-real-page',
  ]

  for (const route of routes) {
    await page.goto(route)
    const hero = page.locator('main .page-hero, main .not-found, main .home-hero').first()
    await expect(hero).toBeVisible()
    const background = await hero.evaluate((element) => getComputedStyle(element, '::before').backgroundImage)
    expect(background, `${route} should have a local hero image`).toMatch(/[a-z0-9-]+\.(jpg|webp)/)
    if (route !== '/') await expect(page.getByText('Illustrative image', { exact: true })).toBeVisible()
  }
})

test('business directory hero heading uses compact sizing', async ({ page }) => {
  for (const [width, height] of [[1440, 900], [375, 812]]) {
    await page.setViewportSize({ width, height })
    await page.goto('/other-businesses')
    const heading = page.locator('.page-hero--compact h1')
    await expect(heading).toBeVisible()
    const fontSize = await heading.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize))
    expect(fontSize).toBeLessThanOrEqual(width > 700 ? 72 : 45)
    await expect(page.locator('.page-hero--compact p')).toBeVisible()
  }
})

test('visual library filters to school images', async ({ page }) => {
  await page.goto('/other-businesses')
  await page.getByRole('button', { name: 'Education' }).click()
  await expect(page.locator('.visual-gallery img')).toHaveCount(4)
  await expect(page.locator('.visual-gallery img').first()).toHaveAttribute('src', '/school-campus-low-rise.jpg')
})

test('AOS reveals a visual card when it enters the viewport', async ({ page }) => {
  await page.goto('/other-businesses')
  const card = page.locator('.visual-card').first()
  await expect(card).toHaveAttribute('data-aos', 'fade-up')
  await expect(card).not.toHaveClass(/aos-animate/)
  await card.scrollIntoViewIfNeeded()
  await expect(card).toHaveClass(/aos-animate/)
})

test('reduced motion keeps visual cards visible without AOS animation', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4173/other-businesses')
  const card = page.locator('.visual-card').first()
  await expect(card).not.toHaveAttribute('data-aos', 'fade-up')
  await expect(card).toBeVisible()
  await context.close()
})

test('homepage hero uses a local public image', async ({ page }) => {
  await page.goto('/')
  const heroBackground = await page.locator('.home-hero').evaluate((element) => getComputedStyle(element, '::before').backgroundImage)
  expect(heroBackground).toContain('/city-office-skyline.jpg')
})

test('contact form requires valid input and explains email fallback', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.getByRole('button', { name: 'Prepare email' })).toBeVisible()
  await expect(page.getByText('This frontend does not submit or store your information.')).toBeVisible()
  await expect(page.getByLabel('Name')).toHaveAttribute('required', '')
  await expect(page.getByLabel('Email')).toHaveAttribute('type', 'email')
})

test('page refresh scrolls smoothly to top and plays page transition', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, 1000))
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(400)
  await page.reload()
  const transition = page.locator('.page-transition')
  await expect(transition).toBeAttached()
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3500 }).toBeLessThan(10)
})

