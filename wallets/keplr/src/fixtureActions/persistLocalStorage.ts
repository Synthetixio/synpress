import type { BrowserContext } from '@playwright/test'

export async function persistLocalStorage(
  origins: {
    origin: string
    localStorage: { name: string; value: string }[]
  }[],
  context: BrowserContext
) {
  const newPage = await context.newPage()

  for (const { origin, localStorage } of origins) {
    const frame = newPage.mainFrame()
    await frame.goto(origin)

    await frame.evaluate((localStorageData) => {
      localStorageData.forEach(({ name, value }) => {
        window.localStorage.setItem(name, value)
      })
    }, localStorage)
  }

  await newPage.close()
}
