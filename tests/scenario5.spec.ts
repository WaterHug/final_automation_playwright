import { test, expect } from '../core/fixtures/baseFixture';
import { Logger } from '../core/utils/logger';
import { cleanupTestData } from '../core/hooks/hooks';
import testData from '@env/test-data/testData.json';
import checkoutData from '@env/test-data/checkoutData.json';

test.describe('Scenario 5: Checkout Flow', () => {

    let userToken = '';
    const targetProduct = testData.product1.name;

    test.beforeEach(async ({ loggedInUser }) => {
        userToken = loggedInUser;
        Logger.info('User is logged in via fixture');
    });

    test.afterEach(async ({ request }) => {
        if (userToken) {
            Logger.info('Cleaning up: Removing orders via API');
            await cleanupTestData(request, userToken);
        }
    });

    // Iterate over the checkoutData array to create individual test cases
    for (const data of checkoutData) {
        test(`Checkout succeeds with ${data.description}`, async ({ productPage, cartPage, checkoutPage }) => {
            const { customerName, customerPhone, customerAddress } = data;

            // 1. Add Product to Cart
            Logger.info(`Adding "${targetProduct}" to the cart`);
            await productPage.navigate();
            await productPage.addProductToCart(targetProduct);

            // 2. Navigate to Cart & Proceed to Checkout
            Logger.info('Navigating to the Cart Page');
            await cartPage.navigate();
            
            Logger.info('Proceeding to Checkout');
            await cartPage.proceedToCheckout();

            // 3. Fill Checkout Form
            Logger.info('Filling out checkout form with valid info');
            await checkoutPage.fillCheckoutForm(customerName, customerPhone, customerAddress);

            // 4. Submit Order (COD is assumed default/implied by your paymentMethod locator)
            Logger.info('Submitting order (COD)');
            await checkoutPage.submitOrder();

            // 5. Verify Success Screen
            Logger.info('Verifying checkout success screen details');
            await checkoutPage.verifySuccessScreen();

            Logger.info('Scenario 5 completed successfully');
        });
    }
});