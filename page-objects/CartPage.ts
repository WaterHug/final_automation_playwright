import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../env/env';

export class CartPage extends BasePage {
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly emptyCartIcon: Locator;
    readonly totalAmount: Locator;

    // String selectors for scoping within a specific cart item
    readonly productNameSelector = '.item-name';
    readonly productPriceSelector = '.item-price';
    readonly quantitySelector = '.qty-value';
    readonly qtyBtnSelector = '.qty-btn';
    readonly itemTotalSelector = '.item-total';
    readonly removeButtonSelector = '.remove-btn';

    constructor(page: Page) {
        super(page);
        
        this.cartItems = page.locator('.cart-item');
        this.checkoutButton = page.locator('.checkout-btn');
        this.emptyCartIcon = page.locator('.empty-icon');
        this.totalAmount = page.locator('.cart-total, .total-amount');
    }

    async navigate() {
        await this.goto(ENV.CART_URL);
    }

    /**
     * Helper to get a specific cart item row by the product name
     */
    getCartItem(productName: string): Locator {
        return this.cartItems.filter({
            has: this.page.locator(this.productNameSelector, {
                hasText: productName,
            }),
        });
    }

    async getProductPrice(productName: string): Promise<string | null> {
        const item = this.getCartItem(productName);
        return await item.locator(this.productPriceSelector).textContent();
    }

    async getProductQuantity(productName: string): Promise<string | null> {
        const item = this.getCartItem(productName);
        return await item.locator(this.quantitySelector).textContent();
    }

    async increaseProductQuantity(productName: string) {
        const item = this.getCartItem(productName);
        // Assuming the last button is "Increase" based on previous specs
        await item.locator(this.qtyBtnSelector).last().click();
    }

    async decreaseProductQuantity(productName: string) {
        const item = this.getCartItem(productName);
        // Assuming the first button is "Decrease" based on previous specs
        await item.locator(this.qtyBtnSelector).first().click();
    }

    async removeProduct(productName: string) {
        const item = this.getCartItem(productName);
        await item.locator(this.removeButtonSelector).click();
    }

    async getProductTotal(productName: string): Promise<string | null> {
        const item = this.getCartItem(productName);
        return await item.locator(this.itemTotalSelector).textContent();
    }

    async verifyOnCartPage() {
        await expect(this.page).toHaveURL(ENV.CART_URL);
    }

    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async verifyCartIsEmpty() {
        await expect(this.emptyCartIcon).toBeVisible();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async getCartTotal(): Promise<string | null> {
        return await this.totalAmount.textContent();
    }
}
