import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../env/env';

export class ProductPage extends BasePage {
    readonly productCards: Locator;
    readonly cartIcon: string;
    readonly cartBadge: Locator;

    constructor(page: Page) {
        super(page);
        this.productCards = page.locator('.product-card'); 
        this.cartIcon = '.add-to-cart';
        this.cartBadge = page.locator('.cart-badge'); 
    }

    async navigate() {
        await this.goto(ENV.HOME_URL);
    }

    private getProductCard(productName: string): Locator {
        return this.productCards.filter({
            has: this.page.locator('.product-name', {
                hasText: productName,
            }),
        });
    }

    async getCartBadgeCount(): Promise<number> {
        // If badge is not attached/visible, we assume the cart is empty (0)
        // We use a small timeout so Playwright doesn't wait the full default 30s if it's missing
        const isVisible = await this.cartBadge.isVisible({ timeout: 1000 }).catch(() => false);
        
        if (!isVisible) {
            return 0;
        }

        const text = await this.cartBadge.textContent();
        const count = text ? parseInt(text.trim(), 10) : 0;
        return isNaN(count) ? 0 : count;
    }

    async addProductToCart(productName: string) {
        const productCard = this.getProductCard(productName);
        await productCard.locator(this.cartIcon).click();
    }

    /**
     * Verifies that the cart badge shows the expected number.
     * Handles the case where 0 means the badge is hidden.
     */
    async verifyCartBadgeCount(expectedCount: number) {
        if (expectedCount === 0) {
            // Assert that the badge is entirely hidden or removed from the DOM
            await expect(this.cartBadge).toBeHidden({ timeout: 5000 });
        } else {
            // Assert it becomes visible and has the correct text
            await expect(this.cartBadge).toBeVisible({ timeout: 5000 });
            await expect(this.cartBadge).toHaveText(expectedCount.toString(), { timeout: 5000 });
        }
    }

    /**
     * Adds a product to cart and immediately verifies the badge increased by 1
     */
    async addProductAndVerifyBadge(productName: string) {
        const initialCount = await this.getCartBadgeCount();
        await this.addProductToCart(productName);
        await this.verifyCartBadgeCount(initialCount + 1);
    }

    async getProductCount(): Promise<number> {
        return await this.productCards.count();
    }
}