import { test, expect } from '../core/fixtures/baseFixture';
import { Logger } from '../core/utils/logger';
import { cleanupTestData } from '../core/hooks/hooks';
import testData from '@env/test-data/testData.json';

test.describe('Scenario 2: Single Product Cart Flow', () => {

    const targetProduct = testData.product1.name;
    let userToken = ''; 

    test.beforeEach(async ({ loggedInUser, request }) => {
        userToken = loggedInUser;
        Logger.info('User is logged in via fixture');

        await cleanupTestData(request, userToken);
        Logger.info('Cleaning up cart before test via API...');
    });

    test.afterEach(async ({ request }) => {
        if (userToken) {
            await cleanupTestData(request, userToken);
            Logger.info('Cleaning up: Removing product from cart via API');
        } else {
            Logger.error('Skipping API cleanup because userToken is empty.');
        }
    });

    test('Add a single product to cart — verify quantity & cart page', async ({ productPage, cartPage }) => {
        // 1. Add Product to Cart
        await productPage.navigate();
        await productPage.addProductAndVerifyBadge(targetProduct);
        Logger.info(`Added "${targetProduct}" to the cart`);

        // 2. Navigate to Cart
        await cartPage.navigate();
        Logger.info('Go to Cart Page');

        // 3. Verify the Cart Items & Quantity
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);

        // Verify the product name is present in the cart
        await expect(cartPage.getCartItem(targetProduct)).toBeVisible();
        Logger.info(`Verified product "${targetProduct}" is visible in the cart.`);

        const quantity = await cartPage.getProductQuantity(targetProduct);
        expect(quantity?.trim()).toBe('1');
        
        Logger.info(`Found "${quantity}" of "${targetProduct}" in the cart`);
    });
});