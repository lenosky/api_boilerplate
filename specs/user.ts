import { expect } from 'chai';
import { serviceProvider } from '../framework';

describe('User', function () {

    it('user info', async () => {
        const userService = new serviceProvider.user();
        const { body, status } = await userService.getRegistrationInfo('defaultemail@domain.com', 'DEFAULT');
        expect(status).to.eq(200);
        expect(body).to.include.keys('assignedProjects', 'email', 'userId', 'userRole');
    });
});