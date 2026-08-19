import { test, expect } from '../core/fixtures/baseFixture';
import { Logger } from '../core/utils/logger';
import { APIHelper } from '../core/api/api';
import testData from '@env/test-data/testData.json'; // FIX: Use path alias for import

test.describe('Scenario 6: Update Full Name in profile, then clean up via API', () => {

    let userToken = '';
    let initialNameFromAPI: string;
    const updatedName = testData.updatedName;

    test.beforeEach(async ({ loggedInUser, request }) => {
        userToken = loggedInUser;
        Logger.info('User is logged in via fixture');

        // Get initial name via API after login
        const api = new APIHelper(request);
        const profileInfo = await api.getProfile(userToken);
        initialNameFromAPI = profileInfo.name || (profileInfo.data && profileInfo.data.name) || testData.validUser.originalName;
        Logger.info(`Fetched initial name from API: ${initialNameFromAPI}`);
    });

    test.afterEach(async ({ request }) => {
        if (userToken && initialNameFromAPI) {
            Logger.info('Cleaning up: Restoring original profile name via API');
            const api = new APIHelper(request);
            await api.updateProfile(initialNameFromAPI, userToken);
        }
    });

    test('Update Full Name in profile via UI and verify', async ({ profilePage, request }) => {
        
        // 1. Navigate to Profile Page
        Logger.info('Navigating to the Profile Page');
        await profilePage.navigate();
        await profilePage.verifyOnProfilePage();

        // Verify initial name fetched from API
        const currentName = await profilePage.getProfileName();
        expect(currentName).toBe(initialNameFromAPI);

        // 2. Update Profile Name via UI
        Logger.info(`Updating profile name to: ${updatedName}`);
        await profilePage.editProfileName(updatedName);
        
        // 3. Verify on UI
        Logger.info('Verifying updated name on UI');
        // A reload might be needed depending on the app's behavior to confirm it was saved
        await profilePage.reload(); 
        const savedName = await profilePage.getProfileName();
        expect(savedName).toBe(updatedName);

        // 4. Verify via API
        Logger.info('Verifying updated name via API');
        const api = new APIHelper(request);
        const profileInfo = await api.getProfile(userToken);
        
        // Assuming the API returns the profile object containing a "name" or "data.name" field
        const apiSavedName = profileInfo.name || (profileInfo.data && profileInfo.data.name);
        expect(apiSavedName).toBe(updatedName);

        Logger.info('Scenario 6 completed successfully');
    });
});