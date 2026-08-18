import { test as base } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';
import { ProductPage } from '../../page-objects/ProductPage';
import { CartPage } from '../../page-objects/CartPage';
import { CheckoutPage } from '../../page-objects/CheckoutPage';
import { ProfilePage } from '../../page-objects/ProfilePage';
import { Logger } from '../utils/logger';
import testData from '@env/test-data/testData.json';

type AppFixtures = {
    loginPage: LoginPage;
    productPage: ProductPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    profilePage: ProfilePage;
    // Changed to return a string (the token) instead of void
    loggedInUser: string; 
};

// Helper function to extract token from browser
const extractAuthToken = async (page: any): Promise<string> => {
    let token = await page.evaluate(() => {
        const searchStorage = (storage: Storage) => {
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key && (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth') || key.toLowerCase().includes('session'))) {
                    return storage.getItem(key);
                }
            }
            return null;
        };

        let t = localStorage.getItem('token') || localStorage.getItem('accessToken') || 
                sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
        
        if (!t) t = searchStorage(localStorage) || searchStorage(sessionStorage);
        return t || '';
    });

    if (!token) {
        const cookies = await page.context().cookies();
        const tokenCookie = cookies.find((c: any) => 
            c.name.toLowerCase().includes('token') || 
            c.name.toLowerCase().includes('auth') || 
            c.name.toLowerCase().includes('session')
        );
        if (tokenCookie) token = tokenCookie.value;
    }
    return token;
};

// Extend the base test with our Page Object fixtures
export const test = base.extend<AppFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    
    productPage: async ({ page }, use) => {
        const productPage = new ProductPage(page);
        await use(productPage);
    },

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },

    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },

    profilePage: async ({ page }, use) => {
        const profilePage = new ProfilePage(page);
        await use(profilePage);
    },

    // This fixture automatically logs the user in and yields their auth token!
    loggedInUser: async ({ loginPage, page }, use) => {
        await loginPage.navigate();
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        await loginPage.verifyLoginSuccess();
        
        // Wait for network to be idle to ensure any auth tokens are saved to browser storage/cookies
        await page.waitForLoadState('networkidle').catch(() => {});
        
        // Extract the token
        const token = await extractAuthToken(page);
        if (!token) {
            Logger.info('Warning: loggedInUser fixture could not extract an auth token.');
        }

        // Yield the token to the test so it can be used for API teardowns
        await use(token);
    }
});

export { expect } from '@playwright/test';
