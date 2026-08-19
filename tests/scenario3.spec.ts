import { test, expect } from '../core/fixtures/baseFixture';
import { Logger } from '../core/utils/logger';
import { cleanupTestData } from '../core/hooks/hooks';
import testData from '@env/test-data/testData.json';

test.describe('Scenario 3: Add the same product twice - quantity increments correctly', () => {

    let userToken = '';
    const targetProduct = testData.product1.name;

    test.beforeEach(async ({ loggedInUser, request }) => {
        userToken = loggedInUser;
        Logger.info('User is logged in via fixture');

        await cleanupTestData(request, userToken);
        Logger.info('Cleaning up cart before test via API...');
    });

    test.afterEach(async ({ request }) => {
        if (userToken) {
            await cleanupTestData(request, userToken);
            Logger.info('Cleaning up: Removing orders and clearing cart via API');
        }
    });

    test('Adding the same product twice increments quantity in cart', async ({ productPage, cartPage }) => {
        // 1. Add Product to Cart for the first time
        await productPage.navigate();
        await productPage.addProductToCart(targetProduct);
        Logger.info(`Added "${targetProduct}" to the cart for the first time`);

        // 2. Add the SAME Product to Cart for the second time
        await productPage.addProductToCart(targetProduct);
        Logger.info(`Added "${targetProduct}" to the cart for the second time`);

        // 3. Navigate to Cart Page
        await cartPage.navigate();
        Logger.info('Go to the Cart Page');
        
        // 4. Verify product quantity in cart
        const productQuantity = await cartPage.getProductQuantity(targetProduct);
        expect(productQuantity).toBe('2'); // Expecting quantity to be 2

        Logger.info(`Found "${productQuantity}" of "${targetProduct}" in the cart`);
    });
});