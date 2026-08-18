import { test, expect } from '../core/fixtures/baseFixture';
import { Logger } from '../core/utils/logger';
import { cleanupTestData } from '../core/hooks/hooks';
import testData from '../env/test-data/testData.json'; // Import the consolidated test data

test.describe('Scenario 4: Remove item from cart', () => {

    let userToken = '';
    const product1 = testData.product1.name;
    const product2 = testData.product2.name;

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

    test('Remove a single item from the cart', async ({ productPage, cartPage }) => {
        // 1. Add two different products to the cart
        Logger.info(`Adding "${product1}" to the cart`);
        await productPage.navigate();
        await productPage.addProductToCart(product1);

        Logger.info(`Adding "${product2}" to the cart`);
        await productPage.addProductToCart(product2);

        // 2. Navigate to Cart Page
        Logger.info('Navigating to the Cart Page');
        await cartPage.navigate();
        await cartPage.verifyOnCartPage();

        // Verify initial cart state
        let initialCartItemCount = await cartPage.getCartItemCount();
        expect(initialCartItemCount).toBe(2);
        await expect(cartPage.getCartItem(product1)).toBeVisible();
        await expect(cartPage.getCartItem(product2)).toBeVisible();

        // 3. Remove one product
        Logger.info(`Removing "${product1}" from the cart`);
        await cartPage.removeProduct(product1);

        // 4. Verify the removed product is no longer in the cart
        Logger.info(`Verifying "${product1}" is removed and "${product2}" remains`);
        await expect(cartPage.getCartItem(product1)).not.toBeVisible();
        await expect(cartPage.getCartItem(product2)).toBeVisible();

        // 5. Verify cart item count decreased
        let finalCartItemCount = await cartPage.getCartItemCount();
        expect(finalCartItemCount).toBe(1);

        Logger.info('Scenario 4 - Remove single item completed successfully');
    });

    test('Remove multiple items from cart, leading to an empty cart', async ({ productPage, cartPage }) => {
        // 1. Add two different products to the cart
        Logger.info(`Adding "${product1}" to the cart`);
        await productPage.navigate();
        await productPage.addProductToCart(product1);

        Logger.info(`Adding "${product2}" to the cart`);
        await productPage.addProductToCart(product2);

        // 2. Navigate to Cart Page
        Logger.info('Navigating to the Cart Page');
        await cartPage.navigate();
        await cartPage.verifyOnCartPage();

        // Verify initial cart state
        let initialCartItemCount = await cartPage.getCartItemCount();
        expect(initialCartItemCount).toBe(2);

        // 3. Remove first product
        Logger.info(`Removing "${product1}" from the cart`);
        await cartPage.removeProduct(product1);
        await expect(cartPage.getCartItem(product1)).not.toBeVisible();
        expect(await cartPage.getCartItemCount()).toBe(1);

        // 4. Remove second product
        Logger.info(`Removing "${product2}" from the cart`);
        await cartPage.removeProduct(product2);
        await expect(cartPage.getCartItem(product2)).not.toBeVisible();
        
        // 5. Verify cart is empty
        Logger.info('Verifying the cart is empty');
        await cartPage.verifyCartIsEmpty();

        Logger.info('Scenario 4 - Remove multiple items completed successfully');
    });
});