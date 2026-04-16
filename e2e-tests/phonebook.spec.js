import { test, expect } from '@playwright/test'

test.describe('Phonebook app', () => {

  test('front page can be opened', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Phonebook App')).toBeVisible()
  })

})