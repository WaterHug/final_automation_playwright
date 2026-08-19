import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../env/env';

export class CheckoutPage extends BasePage {
    // Form Inputs
    readonly nameInput: Locator;
    readonly phoneInput: Locator;
    readonly addressInput: Locator;
    readonly submitOrderButton: Locator;

    // Success Screen Elements
    readonly successHeading: Locator;
    readonly receiverName: Locator;
    readonly receiverAddress: Locator;
    readonly paymentMethod: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        super(page);
        
        this.nameInput = page.getByTestId('checkout-name');
        this.phoneInput = page.getByTestId('checkout-phone');
        this.addressInput = page.getByTestId('checkout-address');
        this.submitOrderButton = page.locator('.btn-checkout, button[type="submit"]');

        // Locators for success page
        this.successHeading = page.getByTestId('checkout-success-heading');
        this.receiverName = page.locator('.checkout-success p').nth(1).locator('strong');
        this.receiverAddress = page.locator('.checkout-success p').nth(2);
        this.paymentMethod = page.locator('.checkout-success p').nth(3).locator('strong');
        this.continueShoppingButton = page.getByTestId('checkout-continue');
    }

    async navigate() {
        await this.goto(ENV.CHECKOUT_URL);
    }

    /**
     * Fills out the checkout form with the provided details
     */
    async fillCheckoutForm(name: string, phone: string, address: string) {
        await this.nameInput.fill(name);
        await this.phoneInput.fill(phone);
        await this.addressInput.fill(address);
    }

    /**
     * Submits the order
     */
    async submitOrder() {
        await this.submitOrderButton.click();
    }

    /**
     * Verifies that the success screen contains the expected information: name, address, and payment method.
     */
    async verifySuccessScreen(expectedName: string, expectedAddress: string, expectedPaymentMethod: string) {
        // Wait for the success heading to be visible
        await expect(this.successHeading).toBeVisible();

        // Verify receiver name
        await expect(this.receiverName).toHaveText(expectedName);
        
        // Verify receiver address
        await expect(this.receiverAddress).toHaveText(expectedAddress);

        // Verify payment method
        await expect(this.paymentMethod).toContainText(expectedPaymentMethod);
    }
}