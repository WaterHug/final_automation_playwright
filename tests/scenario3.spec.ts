import { test, expect } from '../core/fixtures/baseFixture';
import { Logger } from '../core/utils/logger';
import { cleanupTestData } from '../core/hooks/hooks';
import testData from '@env/test-data/testData.json';

test.describe('Scenario 3: Add the same product twice - quantity increments correctly', () => {

    let userToken = '';
    const targetProduct = testData.product1.name; // Use product name from testData.json

    test.beforeEach(async ({ loggedInUser }) => {
        userToken = loggedInUser;
        Logger.info('User is logged in via fixture');
    });

    test.afterEach(async ({ request }) => {
        if (userToken) {
            Logger.info('Cleaning up: Removing orders and clearing cart via API');
            await cleanupTestData(request, userToken);
        }
    });

    test('Adding the same product twice increments quantity in cart', async ({ productPage, cartPage }) => {
        // 1. Add Product to Cart for the first time
        Logger.info(`Adding "${targetProduct}" to the cart for the first time`);
        await productPage.navigate();
        await productPage.addProductToCart(targetProduct);

        // 2. Add the SAME Product to Cart for the second time
        Logger.info(`Adding "${targetProduct}" to the cart for the second time`);
        await productPage.addProductToCart(targetProduct);

        // 3. Navigate to Cart Page
        Logger.info('Navigating to the Cart Page');
        await cartPage.navigate();
        
        // 4. Verify product quantity in cart
        Logger.info(`Verifying quantity of "${targetProduct}" in the cart`);
        const productQuantity = await cartPage.getProductQuantity(targetProduct);
        expect(productQuantity).toBe('2'); // Expecting quantity to be 2

        Logger.info('Scenario 3 completed successfully');
    });
});