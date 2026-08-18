import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../env/env';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('.login-btn');
        this.errorMessage = page.locator('.error-message, #error, [role="alert"]');
    }

    async navigate() {
        await this.goto(ENV.LOGIN_URL);
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyLoginSuccess() {
        await expect(this.page).toHaveURL(ENV.HOME_URL);
    }

    async verifyLoginFailure(expectedErrorMessage?: string) {
        await expect(this.page).not.toHaveURL(ENV.HOME_URL);
        
        await expect(this.errorMessage.first()).toBeVisible();
        
        if (expectedErrorMessage) {
            await expect(this.errorMessage.first()).toContainText(expectedErrorMessage);
        }
    }
}
