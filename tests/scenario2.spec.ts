import { test, expect } from '../core/fixtures/baseFixture';
import { Logger } from '../core/utils/logger';
import { cleanupTestData } from '../core/hooks/hooks';
import testData from '@env/test-data/testData.json';

test.describe('Scenario 2: Single Product Cart Flow', () => {

    const targetProduct = testData.product1.name;
    let userToken = ''; 

    test.beforeEach(async ({ loggedInUser }) => {
        // The loggedInUser fixture now handles login AND returns the token!
        userToken = loggedInUser;
        Logger.info('User is logged in via fixture');
    });

    test.afterEach(async ({ request }) => {
        if (userToken) {
            Logger.info('Cleaning up: Removing product from cart via API');
            await cleanupTestData(request, userToken);
        } else {
            Logger.error('Skipping API cleanup because userToken is empty.');
        }
    });

    test('Add a single product to cart — verify quantity & cart page', async ({ productPage, cartPage }) => {
        // 1. Add Product to Cart
        Logger.info(`Adding "${targetProduct}" to the cart`);
        await productPage.navigate();
        await productPage.addProductAndVerifyBadge(targetProduct);

        // 2. Navigate to Cart
        Logger.info('Navigating to the Cart Page');
        await cartPage.navigate();

        // 3. Verify the Cart Items & Quantity
        Logger.info('Verifying cart item details');
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1); 

        const quantity = await cartPage.getProductQuantity(targetProduct);
        expect(quantity?.trim()).toBe('1');
        
        Logger.info('Scenario 2 completed successfully');
    });
});
