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
            const { customerName, customerPhone, customerAddress, paymentMethod } = data; // Destructure paymentMethod

            // 1. Add Product to Cart
            await productPage.navigate();
            await productPage.addProductToCart(targetProduct);
            Logger.info(`Added "${targetProduct}" to the cart`);

            // 2. Navigate to Cart & Proceed to Checkout
            Logger.info('Go to the Cart Page');
            await cartPage.navigate();
            
            Logger.info('Proceeding to Checkout');
            await cartPage.proceedToCheckout();

            // 3. Fill Checkout Form
            await checkoutPage.fillCheckoutForm(customerName, customerPhone, customerAddress);
            Logger.info('Filled out checkout form with valid info');

            // 4. Submit Order (COD is assumed default/implied by your paymentMethod locator)
            Logger.info('Submitting order (COD)');
            await checkoutPage.submitOrder();

            // 5. Verify Success Screen
            Logger.info('Verifying checkout success screen details');
            await checkoutPage.verifySuccessScreen(customerName, customerAddress, paymentMethod);
        });
    }
});