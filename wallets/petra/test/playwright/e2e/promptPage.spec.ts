import { connectPetraToTestDapp } from '../commonSteps/connectPetraToTestDapp'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should check that the confirm button is not disabled', async ({ page, petra }) => {
  test.setTimeout(90_000)

  await connectPetraToTestDapp(page, petra)

  const [promptPage] = await Promise.all([
    petra.getPromptPage(),
    page.getByRole('button', { name: /^sign message$/i }).click()
  ])

  const approveButton = promptPage.getByRole('button', { name: /^approve$/i })
  await expect(approveButton).not.toBeDisabled()
})

test('should check that the confirm button is disabled', async ({ page, petra }) => {
  test.setTimeout(90_000)

  await connectPetraToTestDapp(page, petra)

  const [promptPage] = await Promise.all([
    petra.getPromptPage(),
    page.getByRole('button', { name: /^sign transaction$/i }).click()
  ])

  const approveButton = promptPage.getByRole('button', { name: /^approve$/i })
  await expect(approveButton, {
    message: 'The button is disabled because the wrong action is being executed on mainnet'
  }).toBeDisabled()
})
