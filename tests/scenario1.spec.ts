import { test } from '../core/fixtures/baseFixture';
import { Logger } from '../core/utils/logger';
import testData from '@env/test-data/testData.json';

test.describe('Login Tests', () => {
    // We now destructure `loginPage` directly from the fixture
    test('Login successfully', async ({ loginPage }) => {
        Logger.info('Go to login page');
        await loginPage.navigate();
        
        Logger.info('Attempting login');
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        
        Logger.info('Verifying login success');
        await loginPage.verifyLoginSuccess();
    });

    test('Login failed with blank username and password', async ({ loginPage }) => {
        Logger.info('Go to login page');
        await loginPage.navigate();
        
        Logger.info('Attempting login with invalid credentials');
        await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);
        
        Logger.info('Verifying login failure');
        await loginPage.verifyLoginFailure();
    });
});
