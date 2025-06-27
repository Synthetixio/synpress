import { type Page, expect } from "@playwright/test";
import type { Petra } from "../../../src/playwright";

export const connectPetraToTestDapp = async (page: Page, petra: Petra) => {
  await expect(async () => {
    await page.goto("/");

    // Delay to avoid random fails
    await page.locator("#connectButton").click({ delay: 2_000 });

    await petra.connectToDapp();

    await expect(page.locator("#accounts")).toHaveText(
      "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
    );
  }).toPass();
};
