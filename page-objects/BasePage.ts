import { Page, Locator } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(url: string) {
        await this.page.goto(url);
    }

    getCurrentUrl(): string {
        return this.page.url();
    }

    async waitForUrl(pattern: string | RegExp) {
        await this.page.waitForURL(pattern);
    }

    async click(selector: string) {
        await this.page.click(selector);
    }

    async fill(selector: string, text: string) {
        await this.page.fill(selector, text);
    }

    async getText(selector: string): Promise<string> {
        return await this.page.textContent(selector) || '';
    }

    async waitForElement(selector: string) {
        await this.page.waitForSelector(selector);
    }

    async isElementVisible(selector: string): Promise<boolean> {
        try {
            return await this.page.isVisible(selector);
        } catch {
            return false;
        }
    }

    getLocator(selector: string): Locator {
        return this.page.locator(selector);
    }

    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
}
