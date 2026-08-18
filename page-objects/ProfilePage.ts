import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../env/env';

export class ProfilePage extends BasePage {
    readonly profileName: Locator;
    readonly saveProfileButton: Locator;

    constructor(page: Page) {
        super(page);
        
        this.profileName = page.getByTestId('profile-name');
        this.saveProfileButton = page.locator('.pf-save-btn, [data-test="profile-save"]');
    }

    async navigate() {
        await this.goto(ENV.PROFILE_URL);
    }

    async verifyOnProfilePage() {
        await expect(this.page).toHaveURL(ENV.PROFILE_URL);
    }

    async getProfileName(): Promise<string | null> {
        return await this.profileName.inputValue().catch(async () => {
             // Fallback to textContent just in case it's not an input type
             return await this.profileName.textContent();
        });
    }

    async editProfileName(profileName: string) {
        await this.profileName.click();
        await this.profileName.fill(profileName);
        await this.saveProfileButton.click();
    }

    // Add a public reload method to encapsulate the protected page access
    async reload() {
        await this.page.reload();
    }
}